import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProperttyValueEntity } from 'src/entities/properttyValue.entity';
import { ProperttyValueHistoryEntity } from 'src/entities/properttyValueHistory.entity';
import { Repository } from 'typeorm';

import { UpdateDto } from './dto/update.dto';
@Injectable()
export class ProperttyValueService {
  constructor(
    @InjectRepository(ProperttyValueEntity)
    private readonly properttyValueRepository: Repository<ProperttyValueEntity>,
    @InjectRepository(ProperttyValueHistoryEntity)
    private readonly properttyValueHistoryRepository: Repository<ProperttyValueHistoryEntity>,
  ) {}

  async getAll() {
    return await this.properttyValueRepository.find({
      where: { trash: false },
    });
  }

  async getAllTrash() {
    return await this.properttyValueRepository.find({
      where: { trash: true },
    });
  }

  async allHistory() {
    return await this.properttyValueHistoryRepository.find();
  }

  async findById(id: string) {
    return await this.properttyValueRepository.findOne({ where: { id } });
  }

  async createHistory(body: { submiter: string; content: string }) {
    const history = this.properttyValueHistoryRepository.create(body);
    await this.properttyValueHistoryRepository.save(history);
  }

  async add(body: { name: string; properttyId: string; submiter: string }) {
    const item = this.properttyValueRepository.create(body);
    return await this.properttyValueRepository.save(item);
  }

  async update(id: string, body: UpdateDto) {
    return await this.properttyValueRepository.update(id, body);
  }

  async remove(id: string) {
    await this.properttyValueRepository.delete(id);
  }
}
