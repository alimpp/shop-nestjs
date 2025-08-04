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
        const category = await this.categoryRepository.findOne({ where: { id } })
        console.log(category);
        if(!category) throw new NotFoundException(`category with id ${id} not found`)
        return category
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
        const category = await this.categoryRepository.find({ where: { id } })
        if(!category) throw new NotFoundException(`category with id ${id} not found`)
        return await this.categoryRepository.update(id, body)
    }

    async remove(id: string) {
        const category = await this.categoryRepository.find({ where: { id } })
        if(!category) throw new NotFoundException(`category with id ${id} not found`)
        await this.categoryRepository.delete(id)
    }
}
