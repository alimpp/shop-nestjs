import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/entities/address.entity';

import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class AddressService {
    constructor(
      @InjectRepository(AddressEntity)
      private readonly addressRepository: Repository<AddressEntity>,
    ) {}

    async getAllAddress() {
        return await this.addressRepository.find()
    }

    async getUserAddress(userId: string) {
        return await this.addressRepository.find({ where: {userId} })
    }

    async add(body: CreateDto) {
        const address = this.addressRepository.create(body)
        return await this.addressRepository.save(address)
    }

    async update(id: string, body: UpdateDto) {
        const address = await this.addressRepository.find({ where: { id } })
        if(!address) {
          throw new NotFoundException(`Address with ${id} not found`)
        }
        return await this.addressRepository.update(id, body)
    }

    async remove(id: string) {
        await this.addressRepository.delete(id)
    }
}
