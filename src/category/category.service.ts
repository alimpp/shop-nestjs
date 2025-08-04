import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';

import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto'

@Injectable()
export class CategoryService {
    constructor(
      @InjectRepository(CategoryEntity)
      private readonly categoryRepository: Repository<CategoryEntity>,
    ) {}

    async getAll() {
        return await this.categoryRepository.find()
    }

    async add(body: {name: string, submiter: string}) {
        const address = this.categoryRepository.create(body)
        return await this.categoryRepository.save(address)
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
