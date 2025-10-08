import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvenotryEntity } from 'src/entities/inventory.entity';
import { InvenotryProductsEntity } from 'src/entities/inventoryProducts.entity';
import { Repository } from 'typeorm';
import { CreateDto, InvenotryProductsCreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InvenotryEntity)
    private readonly invenotryRepository: Repository<InvenotryEntity>,
    @InjectRepository(InvenotryProductsEntity)
    private readonly invenotryProductsRepository: Repository<InvenotryProductsEntity>,
  ) {}

  async getAll() {
    return await this.invenotryRepository.find();
  }

  async add(body: CreateDto) {
    const item = this.invenotryRepository.create(body);
    return await this.invenotryRepository.save(item);
  }

  async findById(id: string) {
    return await this.invenotryProductsRepository.find({
      where: {
        id,
      },
    });
  }

  async update(id: string, body: UpdateDto) {
    return await this.invenotryRepository.update(id, body);
  }

  async remove(id: string) {
    await this.invenotryRepository.delete(id);
  }

  async getInventoryProducts(body: { inventoryId: string }) {
    return await this.invenotryProductsRepository.find({
      where: {
        inventoryId: body.inventoryId,
      },
    });
  }

  async detectProductInInventory(body: {
    inventoryId: string;
    productId: string;
  }) {
    return await this.invenotryProductsRepository.findOne({
      where: {
        inventoryId: body.inventoryId,
        productId: body.productId,
      },
    });
  }

  async addProductToInventory(body: InvenotryProductsCreateDto) {
    const item = this.invenotryProductsRepository.create(body);
    return await this.invenotryProductsRepository.save(item);
  }

  async updateQuantity(id: string, body: { quantity: number }) {
    return await this.invenotryRepository.update(id, body);
  }

  async removeProductFromInventory(id: string) {
    await this.invenotryRepository.delete(id);
  }
}
