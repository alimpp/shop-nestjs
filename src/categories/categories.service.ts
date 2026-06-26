import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import slugify from 'slugify';

import { Category } from '../entities/categories.entity';

import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const slug = await this.generateSlug(dto.name);

    let parent: Category | null = null;

    if (dto.parentId) {
      parent = await this.categoryRepository.findOne({
        where: {
          id: dto.parentId,
        },
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
    return this.categoryRepository.find({
      relations: {
        parent: true,
      },
      order: {
        sortOrder: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('Category cannot be parent of itself');
      }

      const parent = await this.categoryRepository.findOne({
        where: {
          id: dto.parentId,
        },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      category.parent = parent;
    }

    if (dto.name) {
      category.slug = await this.generateSlug(dto.name);
    }

    Object.assign(category, dto);

    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    const childrenCount = await this.categoryRepository.count({
      where: {
        parentId: id,
      },
    });

    if (childrenCount > 0) {
      throw new BadRequestException('Category has child categories');
    }

    await this.categoryRepository.remove(category);

    return {
      message: 'Category deleted successfully',
    };
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
