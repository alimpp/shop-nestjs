import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductMedia } from './entities/product-media.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Category } from '../categories/entities/categories.entity';
import { Brand } from './entities/brand.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductStatus } from './enums/product-status.enum';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: {
    exists: jest.Mock;
    findOne: jest.Mock;
    createQueryBuilder: jest.Mock;
    save: jest.Mock;
    softRemove: jest.Mock;
    restore: jest.Mock;
    manager: {
      transaction: jest.Mock;
    };
  };
  let productVariantRepository: {
    find: jest.Mock;
  };

  beforeEach(async () => {
    productRepository = {
      exists: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
      restore: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };

    productVariantRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepository,
        },
        {
          provide: getRepositoryToken(ProductMedia),
          useValue: {
            delete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProductVariant),
          useValue: {
            ...productVariantRepository,
            delete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            exists: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Brand),
          useValue: {
            exists: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('پارامترهای بولی query را درست parse می‌کند', async () => {
    const qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };
    productRepository.createQueryBuilder.mockReturnValue(qb);

    await service.findAll({
      isActive: 'false' as unknown as boolean,
      isFeatured: 'true' as unknown as boolean,
      page: '2' as unknown as number,
      limit: '10' as unknown as number,
      sortBy: 'price',
      sortOrder: 'ASC',
    });

    expect(qb.andWhere).toHaveBeenCalledWith(
      'product.isActive = :isActive',
      { isActive: false },
    );
    expect(qb.andWhere).toHaveBeenCalledWith(
      'product.isFeatured = :isFeatured',
      { isFeatured: true },
    );
    expect(qb.orderBy).toHaveBeenCalledWith(
      'product.price',
      'ASC',
    );
    expect(qb.skip).toHaveBeenCalledWith(10);
    expect(qb.take).toHaveBeenCalledWith(10);
  });

  it('برای sortBy نامعتبر خطا می‌دهد', async () => {
    await expect(
      service.findAll({
        sortBy: 'deletedAt',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('برای restore محصول ناموجود خطا می‌دهد', async () => {
    productRepository.findOne.mockResolvedValue(null);

    await expect(service.restore('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('در زمان publish شدن publishedAt را ست می‌کند', async () => {
    const product = {
      id: 'product-id',
      status: ProductStatus.DRAFT,
      publishedAt: undefined,
    };
    productRepository.findOne.mockResolvedValue(product);
    productRepository.save.mockImplementation(async (entity) => entity);

    const result = await service.changeStatus(
      'product-id',
      ProductStatus.PUBLISHED,
    );

    expect(result.status).toBe(ProductStatus.PUBLISHED);
    expect(result.publishedAt).toBeInstanceOf(Date);
  });
});
