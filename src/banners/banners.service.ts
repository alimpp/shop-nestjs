import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannersEntity } from 'src/entities/banners.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannersEntity)
    private readonly bannersRepository: Repository<BannersEntity>,
  ) {}
  async getAll() {
    return await this.bannersRepository.find();
  }

  async findById(id: string) {
    return await this.bannersRepository.findOne({ where: { id } });
  }

  async add(body: CreateDto) {
    const item = this.bannersRepository.create(body);
    return await this.bannersRepository.save(item);
  }

  async update(id: string, body: UpdateDto) {
    return await this.bannersRepository.update(id, body);
  }

  async remove(id: string) {
    await this.bannersRepository.delete(id);
  }
}
