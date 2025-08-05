import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryHistoryEntity } from 'src/entities/categoryHistory.entity';

import { UpdateDto } from './dto/update.dto'

@Injectable()
export class CategoryService {
    constructor(
      @InjectRepository(CategoryEntity)
      private readonly categoryRepository: Repository<CategoryEntity>,
      @InjectRepository(CategoryHistoryEntity)
      private readonly categoryHistoryRepository: Repository<CategoryHistoryEntity>
    ) {}

    async getAll() {
        return await this.categoryRepository.find()
    }

    async allHistory() {
        return await this.categoryHistoryRepository.find()
    }

    async findById(id: string) {
        return await this.categoryRepository.findOne({ where: { id } })
    }

    async createHistory(body: {submiter: string, content: string}) {
        const categoryHistory = this.categoryHistoryRepository.create(body)
        await this.categoryHistoryRepository.save(categoryHistory)
    }

    async add(body: {name: string, submiter: string}) {
        const category = this.categoryRepository.create(body)
        return await this.categoryRepository.save(category)
    }

    async update(id: string, body: UpdateDto) {
        return await this.categoryRepository.update(id, body)
    }

    async remove(id: string) {
        await this.categoryRepository.delete(id)
    }
}
