import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/categories.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Brand } from './entities/brand.entity';
import { ProductMedia } from './entities/product-media.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';
import { ProductStatus } from './enums/product-status.enum';

@Injectable()
export class ProductService {
  private readonly sortableFields = new Set([
    'createdAt',
    'updatedAt',
    'name',
    'price',
    'status',
    'stock',
    'soldCount',
    'viewCount',
  ]);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductMedia)
    private readonly productMediaRepository: Repository<ProductMedia>,

    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(
    dto: CreateProductDto,
  ): Promise<Product> {
    await this.ensureCategoryExists(dto.categoryId);
    await this.ensureBrandExists(dto.brandId);

    const slug = await this.ensureUniqueSlug(dto.slug);
    await this.ensureUniqueSku(dto.sku);
    await this.ensureUniqueVariantSkus(dto.variants);

    const { medias = [], variants = [], ...productData } = dto;

    const savedProduct = await this.productRepository.manager.transaction(
      async (manager) => {
        const product = manager.create(Product, {
          ...productData,
          slug,
        });

        const createdProduct = await manager.save(Product, product);

        await this.replaceProductMedias(
          createdProduct.id,
          medias,
          manager.getRepository(ProductMedia),
        );

        await this.replaceProductVariants(
          createdProduct.id,
          variants,
          manager.getRepository(ProductVariant),
        );

        return createdProduct;
      },
    );

    return this.findOne(savedProduct.id);
  }

  async findAll(
    query: QueryProductDto,
  ) {
    const {
      search,
      categoryId,
      brandId,
      status,
      sortBy,
      sortOrder,
    } = query;

    const minPrice = this.parseNumber(query.minPrice, 'minPrice');
    const maxPrice = this.parseNumber(query.maxPrice, 'maxPrice');
    const isActive = this.parseBoolean(query.isActive, 'isActive');
    const isFeatured = this.parseBoolean(query.isFeatured, 'isFeatured');
    const page = this.parseNumber(query.page ?? 1, 'page', 1) ?? 1;
    const limit = this.parseNumber(query.limit ?? 20, 'limit', 1, 100) ?? 20;
    const safeSortBy = this.normalizeSortBy(sortBy);
    const safeSortOrder = this.normalizeSortOrder(sortOrder);

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.medias', 'medias')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.deletedAt IS NULL');

    if (search) {
      qb.andWhere(
        `
        product.name ILIKE :search
        OR product.sku ILIKE :search
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (brandId) {
      qb.andWhere('product.brandId = :brandId', {
        brandId,
      });
    }

    if (status) {
      qb.andWhere('product.status = :status', {
        status,
      });
    }

    if (typeof isActive !== 'undefined') {
      qb.andWhere('product.isActive = :isActive', {
        isActive,
      });
    }

    if (typeof isFeatured !== 'undefined') {
      qb.andWhere('product.isFeatured = :isFeatured', {
        isFeatured,
      });
    }

    if (typeof minPrice !== 'undefined') {
      qb.andWhere('product.price >= :minPrice', {
        minPrice,
      });
    }

    if (typeof maxPrice !== 'undefined') {
      qb.andWhere('product.price <= :maxPrice', {
        maxPrice,
      });
    }

    qb.orderBy(`product.${safeSortBy}`, safeSortOrder);
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(
    id: string,
  ) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        brand: true,
        medias: true,
        variants: {
          values: {
            attributeValue: {
              attribute: true,
            },
          },
        },
        options: {
          attribute: true,
          values: {
            attributeValue: true,
          },
        },
        productTags: {
          tag: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ) {
    await this.ensureProductExists(id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    if (typeof dto.brandId !== 'undefined') {
      await this.ensureBrandExists(dto.brandId);
    }

    if (dto.slug) {
      dto.slug = await this.ensureUniqueSlug(dto.slug, id);
    }

    if (dto.sku) {
      await this.ensureUniqueSku(dto.sku, id);
    }

    await this.ensureUniqueVariantSkus(dto.variants, id);

    const { medias, variants, ...productData } = dto;

    await this.productRepository.manager.transaction(async (manager) => {
      if (Object.keys(productData).length > 0) {
        await manager.update(Product, id, productData);
      }

      if (typeof medias !== 'undefined') {
        await this.replaceProductMedias(
          id,
          medias,
          manager.getRepository(ProductMedia),
        );
      }

      if (typeof variants !== 'undefined') {
        await this.replaceProductVariants(
          id,
          variants,
          manager.getRepository(ProductVariant),
        );
      }
    });

    return this.findOne(id);
  }

  async remove(
    id: string,
  ) {
    const product = await this.findOne(id);

    await this.productRepository.softRemove(product);

    return {
      message: 'Product deleted successfully',
    };
  }

  async restore(
    id: string,
  ) {
    const product = await this.productRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.restore(id);

    return {
      message: 'Product restored successfully',
    };
  }

  async changeStatus(
    id: string,
    status: ProductStatus,
  ) {
    const product = await this.findOne(id);

    product.status = status;

    if (
      status === ProductStatus.PUBLISHED &&
      !product.publishedAt
    ) {
      product.publishedAt = new Date();
    }

    return this.productRepository.save(product);
  }

  private async ensureProductExists(
    id: string,
  ): Promise<void> {
    const exists = await this.productRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Product not found');
    }
  }

  private async ensureCategoryExists(
    categoryId: string,
  ): Promise<void> {
    const exists = await this.categoryRepository.exists({
      where: { id: categoryId },
    });

    if (!exists) {
      throw new NotFoundException('Category not found');
    }
  }

  private async ensureBrandExists(
    brandId?: string,
  ): Promise<void> {
    if (!brandId) {
      return;
    }

    const exists = await this.brandRepository.exists({
      where: { id: brandId },
    });

    if (!exists) {
      throw new NotFoundException('Brand not found');
    }
  }

  private async ensureUniqueSlug(
    value: string,
    ignoreProductId?: string,
  ): Promise<string> {
    const slug = slugify(value, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (!slug) {
      throw new BadRequestException('Product slug is invalid');
    }

    const existingProduct = await this.productRepository.findOne({
      where: { slug },
      withDeleted: true,
    });

    if (
      existingProduct &&
      existingProduct.id !== ignoreProductId
    ) {
      throw new BadRequestException('Product slug already exists');
    }

    return slug;
  }

  private async ensureUniqueSku(
    sku: string,
    ignoreProductId?: string,
  ): Promise<void> {
    const existingProduct = await this.productRepository.findOne({
      where: { sku },
      withDeleted: true,
    });

    if (
      existingProduct &&
      existingProduct.id !== ignoreProductId
    ) {
      throw new BadRequestException('Product sku already exists');
    }
  }

  private async ensureUniqueVariantSkus(
    variants?: UpdateProductDto['variants'],
    productId?: string,
  ): Promise<void> {
    if (!variants || variants.length === 0) {
      return;
    }

    const seenSkus = new Set<string>();

    for (const variant of variants) {
      if (seenSkus.has(variant.sku)) {
        throw new BadRequestException(
          `Duplicate variant sku: ${variant.sku}`,
        );
      }

      seenSkus.add(variant.sku);
    }

    const existingVariants =
      await this.productVariantRepository.find({
        where: variants.map((variant) => ({
          sku: variant.sku,
        })),
        withDeleted: true,
      });

    const conflictingVariant = existingVariants.find(
      (variant) => variant.productId !== productId,
    );

    if (conflictingVariant) {
      throw new BadRequestException(
        `Variant sku already exists: ${conflictingVariant.sku}`,
      );
    }
  }

  private async replaceProductMedias(
    productId: string,
    medias: CreateProductDto['medias'],
    mediaRepository: Repository<ProductMedia>,
  ): Promise<void> {
    await mediaRepository.delete({ productId });

    if (!medias || medias.length === 0) {
      return;
    }

    const thumbnailCount = medias.filter(
      (media) => media.isThumbnail,
    ).length;

    if (thumbnailCount > 1) {
      throw new BadRequestException(
        'Only one thumbnail media is allowed',
      );
    }

    const createdMedias = medias.map((media) =>
      mediaRepository.create({
        ...media,
        productId,
      }),
    );

    await mediaRepository.save(createdMedias);
  }

  private async replaceProductVariants(
    productId: string,
    variants: CreateProductDto['variants'],
    variantRepository: Repository<ProductVariant>,
  ): Promise<void> {
    await variantRepository.delete({ productId });

    if (!variants || variants.length === 0) {
      return;
    }

    const defaultVariantCount = variants.filter(
      (variant) => variant.isDefault !== false,
    ).length;

    if (defaultVariantCount > 1) {
      throw new BadRequestException(
        'Only one default variant is allowed',
      );
    }

    const createdVariants = variants.map((variant) =>
      variantRepository.create({
        ...variant,
        productId,
      }),
    );

    await variantRepository.save(createdVariants);
  }

  private parseBoolean(
    value: unknown,
    fieldName: string,
  ): boolean | undefined {
    if (typeof value === 'undefined') {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      if (value === 'true') {
        return true;
      }

      if (value === 'false') {
        return false;
      }
    }

    throw new BadRequestException(
      `${fieldName} must be true or false`,
    );
  }

  private parseNumber(
    value: unknown,
    fieldName: string,
    min?: number,
    max?: number,
  ): number | undefined {
    if (typeof value === 'undefined') {
      return undefined;
    }

    const parsedValue =
      typeof value === 'number'
        ? value
        : Number(value);

    if (Number.isNaN(parsedValue)) {
      throw new BadRequestException(
        `${fieldName} must be a valid number`,
      );
    }

    if (typeof min !== 'undefined' && parsedValue < min) {
      throw new BadRequestException(
        `${fieldName} must be greater than or equal to ${min}`,
      );
    }

    if (typeof max !== 'undefined' && parsedValue > max) {
      throw new BadRequestException(
        `${fieldName} must be less than or equal to ${max}`,
      );
    }

    return parsedValue;
  }

  private normalizeSortBy(
    sortBy?: string,
  ): string {
    if (!sortBy) {
      return 'createdAt';
    }

    if (!this.sortableFields.has(sortBy)) {
      throw new BadRequestException('sortBy is invalid');
    }

    return sortBy;
  }

  private normalizeSortOrder(
    sortOrder?: QueryProductDto['sortOrder'],
  ): 'ASC' | 'DESC' {
    if (!sortOrder) {
      return 'DESC';
    }

    const normalizedSortOrder = sortOrder.toUpperCase();

    if (
      normalizedSortOrder !== 'ASC' &&
      normalizedSortOrder !== 'DESC'
    ) {
      throw new BadRequestException('sortOrder is invalid');
    }

    return normalizedSortOrder;
  }
}
