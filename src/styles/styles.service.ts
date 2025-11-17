import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StylesEntity } from 'src/entities/styles.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class StylesService {
  constructor(
    @InjectRepository(StylesEntity)
    private readonly stylesRepository: Repository<StylesEntity>,
  ) {}

  async findById(user: string) {
    return await this.stylesRepository.findOne({ where: { user } });
  }

  async add(body: CreateDto) {
    const item = this.stylesRepository.create(body);
    return await this.stylesRepository.save(item);
  }

  async update(id: string, body: UpdateDto) {
    return await this.stylesRepository.update(id, body);
  }
}
