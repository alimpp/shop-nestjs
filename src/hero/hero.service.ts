import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HeroEntity } from 'src/entities/hero.entity';
import { Repository } from 'typeorm';

import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(HeroEntity)
    private readonly heroRepository: Repository<HeroEntity>,
  ) {}

  async getAll() {
    return await this.heroRepository.find();
  }

  async findById(id: string) {
    return await this.heroRepository.findOne({ where: { id } });
  }

  async add(body: CreateDto) {
    const item = this.heroRepository.create(body);
    return await this.heroRepository.save(item);
  }

  async actived(body: { heroId: string }) {
    const lastActivedHero = await this.heroRepository.findOne({
      where: { active: true },
    });
    if (lastActivedHero) {
      await this.heroRepository.update(lastActivedHero.id, { active: false });
    }
    return await this.heroRepository.update(body.heroId, { active: true });
  }

  async update(id: string, body: UpdateDto) {
    return await this.heroRepository.update(id, body);
  }

  async remove(id: string) {
    await this.heroRepository.delete(id);
  }
}
