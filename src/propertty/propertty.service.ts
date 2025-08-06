import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProperttyEntity } from 'src/entities/propertty.entity';
import { ProperttyHistoryEntity } from 'src/entities/properttyHistory.entity';

import { UpdateDto } from './dto/update.dto'

@Injectable()
export class ProperttyService {
    constructor(
      @InjectRepository(ProperttyEntity)
      private readonly properttyRepository: Repository<ProperttyEntity>,
      @InjectRepository(ProperttyHistoryEntity)
      private readonly properttyHistoryRepository: Repository<ProperttyHistoryEntity>
    ) {}

    async getAll() {
        return await this.properttyRepository.find()
    }

    async allHistory() {
        return await this.properttyHistoryRepository.find()
    }

    async findById(id: string) {
        return await this.properttyRepository.findOne({ where: { id } })
    }

    async createHistory(body: {submiter: string, content: string}) {
        const history = this.properttyHistoryRepository.create(body)
        await this.properttyHistoryRepository.save(history)
    }

    async add(body: {name: string, submiter: string}) {
        const item = this.properttyRepository.create(body)
        return await this.properttyRepository.save(item)
    }

    async update(id: string, body: UpdateDto) {
        return await this.properttyRepository.update(id, body)
    }

    async remove(id: string) {
        await this.properttyRepository.delete(id)
    }
}
