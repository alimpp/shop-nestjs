import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DataSource, Repository, TreeRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { Category } from './entities/categories.entity';

@Injectable()
export class CategoriesService {
  private readonly treeRepository: TreeRepository<Category>;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.treeRepository = this.dataSource.getTreeRepository(Category);
  }

  async create(dto: CreateCategoryDto) {
    const slug = await this.generateSlug(dto.name);

    let parent: Category | null = null;
    if (dto.parentId) {
      parent = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('دسته‌بندی والد پیدا نشد');
      }
    }

    const { parentId, ...rest } = dto;
    const category = this.categoryRepository.create({
      ...rest,
      slug,
    });
    category.parent = parent;

    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.treeRepository.findTrees();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const [ancestorsChain, descendantsTree] = await Promise.all([
      this.treeRepository.findAncestorsTree(category),
      this.treeRepository.findDescendantsTree(category),
    ]);

    return {
      ...descendantsTree,
      ancestors: this.flattenAncestors(ancestorsChain),
    };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('یک دسته‌بندی نمی‌تواند والد خودش باشد');
      }

      const parent = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('دسته‌بندی والد پیدا نشد');
      }

      const descendants = await this.treeRepository.findDescendants(category);
      if (descendants.some((d) => d.id === parent.id)) {
        throw new BadRequestException(
          'دسته‌بندی والد نمی‌تواند یکی از زیرمجموعه‌های همین دسته‌بندی باشد',
        );
      }

      category.parent = parent;
    }

    if (dto.name) {
      category.slug = await this.generateSlug(dto.name);
    }

    const { parentId, ...rest } = dto;
    Object.assign(category, rest);

    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const descendantsCount =
      await this.treeRepository.countDescendants(category);
    if (descendantsCount > 1) {
      throw new BadRequestException(
        'این دسته‌بندی دارای زیرمجموعه است و قابل حذف نیست',
      );
    }

    await this.categoryRepository.remove(category);
    return {
      message: 'Category deleted successfully',
    };
  }

  private flattenAncestors(node: Category): Category[] {
    const chain: Category[] = [];
    let current = node.parent;
    while (current) {
      chain.unshift(current);
      current = current.parent;
    }
    return chain;
  }

  private async generateSlug(name: string): Promise<string> {
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });
    let slug = baseSlug;
    let counter = 1;
    while (
      await this.categoryRepository.exists({
        where: { slug },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }
}
