import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsEntity } from 'src/entities/blogs.entity';
import { BlogsCommentEntity } from 'src/entities/blogsComment.entity';
import { BlogsLikeEntity } from 'src/entities/blogsLike.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogsEntity)
    private readonly blogsRepository: Repository<BlogsEntity>,
    @InjectRepository(BlogsLikeEntity)
    private readonly blogsLikeRepository: Repository<BlogsLikeEntity>,
    @InjectRepository(BlogsCommentEntity)
    private readonly blogsCommentRepository: Repository<BlogsCommentEntity>,
  ) {}

  async getAll() {
    return await this.blogsRepository.find();
  }

  async findById(id: string) {
    return await this.blogsRepository.findOne({ where: { id } });
  }

  async add(body: CreateDto) {
    const item = this.blogsRepository.create(body);
    return await this.blogsRepository.save(item);
  }

  async update(id: string, body: UpdateDto) {
    return await this.blogsRepository.update(id, body);
  }

  async remove(id: string) {
    await this.blogsRepository.delete(id);
  }

  async getAllLike(blogId: string) {
    return await this.blogsLikeRepository.find({ where: { blogId } });
  }

  async findLikeById(body: { blogId: string; likedBy: string }) {
    return await this.blogsLikeRepository.findOne({
      where: {
        blogId: body.blogId,
        likedBy: body.likedBy,
      },
    });
  }

  async liked(body: { blogId: string; likedBy: string }) {
    const item = this.blogsLikeRepository.create(body);
    return await this.blogsLikeRepository.save(item);
  }

  async disLike(id: string) {
    await this.blogsLikeRepository.delete(id);
  }

  async getAllComment(blogId: string) {
    return await this.blogsCommentRepository.find({ where: { blogId } });
  }

  async addComment(body: {
    blogId: string;
    commentFrom: string;
    comment: string;
  }) {
    const item = this.blogsCommentRepository.create(body);
    return await this.blogsCommentRepository.save(item);
  }

  async removeComment(id: string) {
    await this.blogsCommentRepository.delete(id);
  }
}
