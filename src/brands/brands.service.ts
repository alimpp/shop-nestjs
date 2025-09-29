import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandsEntity } from 'src/entities/brand.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandsEntity)
    private readonly brandsRepository: Repository<BrandsEntity>,
  ) {}
  async getAll() {
    return await this.brandsRepository.find();
  }

  async findById(id: string) {
    return await this.brandsRepository.findOne({ where: { id } });
  }

  async add(body: CreateDto) {
    const item = this.brandsRepository.create(body);
    return await this.brandsRepository.save(item);
  }

  async update(id: string, body: UpdateDto) {
    return await this.brandsRepository.update(id, body);
  }

  async remove(id: string) {
    await this.brandsRepository.delete(id);
  }
}
