import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicesEntity } from 'src/entities/services.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesEntity)
    private readonly servicesRepository: Repository<ServicesEntity>,
  ) {}
  async getAll() {
    return await this.servicesRepository.find();
  }

  async findById(id: string) {
    return await this.servicesRepository.findOne({ where: { id } });
  }

  async add(body: CreateDto) {
    const item = this.servicesRepository.create(body);
    return await this.servicesRepository.save(item);
  }

  async update(id: string, body: UpdateDto) {
    return await this.servicesRepository.update(id, body);
  }

  async remove(id: string) {
    await this.servicesRepository.delete(id);
  }
}
