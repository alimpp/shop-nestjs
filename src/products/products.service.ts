import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/entities/products.entity';
import { ProductsCommentEntity } from 'src/entities/productsComment.entity';
import { ProductsLikeEntity } from 'src/entities/productsLike.entity';
import { ILike, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
    @InjectRepository(ProductsLikeEntity)
    private readonly productsLikeRepository: Repository<ProductsLikeEntity>,
    @InjectRepository(ProductsCommentEntity)
    private readonly productsCommentRepository: Repository<ProductsCommentEntity>,
  ) {}

  async getAll() {
    return await this.productsRepository.find();
  }

  async searchByName(name: string) {
    return await this.productsRepository.findOne({ where: { name } });
  }

  async findById(id: string) {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async searchByNameSimilar(name: string): Promise<ProductsEntity[]> {
    return await this.productsRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      order: {
        name: 'ASC',
      },
      take: 20,
    });
  }

  async findByBrand(brand: string) {
    return await this.productsRepository.find({ where: { brand } });
  }

  async findByCategory(category: string) {
    return await this.productsRepository.find({
      where: { category: { id: category } },
    });
  }

  async add(body: CreateDto) {
    const item = this.productsRepository.create(body);
    return await this.productsRepository.save(item);
  }

  async update(id: string, body: UpdateDto) {
    return await this.productsRepository.update(id, body);
  }

  async remove(id: string) {
    await this.productsRepository.delete(id);
  }

  async getAllLike(productId: string) {
    return await this.productsLikeRepository.find({ where: { productId } });
  }

  async findLikeById(body: { productId: string; likedBy: string }) {
    return await this.productsLikeRepository.findOne({
      where: {
        productId: body.productId,
        likedBy: body.likedBy,
      },
    });
  }

  async liked(body: { productId: string; likedBy: string }) {
    const item = this.productsLikeRepository.create(body);
    return await this.productsLikeRepository.save(item);
  }

  async disLike(id: string) {
    await this.productsLikeRepository.delete(id);
  }

  async getAllComment(productId: string) {
    return await this.productsCommentRepository.find({ where: { productId } });
  }

  async addComment(body: {
    productId: string;
    commentFrom: string;
    comment: string;
  }) {
    const item = this.productsCommentRepository.create(body);
    return await this.productsCommentRepository.save(item);
  }

  async removeComment(id: string) {
    await this.productsCommentRepository.delete(id);
  }
}
