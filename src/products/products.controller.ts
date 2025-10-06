import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly adminService: AdminService,
  ) {}
  @Get('/all')
  async getAllItems() {
    return await this.productsService.getAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.productsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.productsService.add(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastData = await this.productsService.findById(id);
    if (!lastData)
      throw new NotFoundException(`Product with id ${id} not found`);
    await this.productsService.update(id, body);
    return {
      success: true,
      message: 'Product updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const target = await this.productsService.findById(id);
    if (!target) throw new NotFoundException(`Hero with id ${id} not found`);
    await this.productsService.remove(id);
    return {
      success: true,
      message: 'Product deleted',
    };
  }

  @Get('/all-likes/:id')
  async getAllLike(@Param('id') productId: string) {
    return await this.productsService.getAllLike(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like')
  async liked(@Body() body: { productId: string }, @Request() req) {
    const targetBlog = await this.productsService.findById(body.productId);
    if (!targetBlog) {
      throw new NotFoundException('Product not found');
    }
    const existingLike = await this.productsService.findLikeById({
      productId: body.productId,
      likedBy: req.user.id,
    });
    if (existingLike) {
      throw new ConflictException('You have already liked this blog');
    }
    await this.productsService.update(body.productId, {
      likes: targetBlog.like + 1,
    });
    return await this.productsService.liked({
      productId: body.productId,
      likedBy: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/dis-like')
  async disLike(@Body() body: { productId: string }, @Request() req) {
    const targetBlog = await this.productsService.findById(body.productId);
    if (!targetBlog) {
      throw new NotFoundException('Product not found');
    }
    const existingLike = await this.productsService.findLikeById({
      productId: body.productId,
      likedBy: req.user.id,
    });
    if (existingLike) {
      throw new ConflictException('You have already liked this blog');
    }
    await this.productsService.update(body.productId, {
      likes: targetBlog.like - 1,
    });
    return await this.productsService.disLike(body.productId);
  }

  @Post('/comments')
  async getAllComment(@Body() body: { productId: string }) {
    const targetBlog = await this.productsService.findById(body.productId);
    if (!targetBlog) {
      throw new NotFoundException('Product not found');
    }
    return await this.productsService.getAllComment(body.productId);
  }

  @Post('/add-comment')
  async addComment(
    @Body() body: { productId: string; comment: string },
    @Request() req,
  ) {
    const targetBlog = await this.productsService.findById(body.productId);
    if (!targetBlog) {
      throw new NotFoundException('Product not found');
    }
    return await this.productsService.addComment({
      ...body,
      commentFrom: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:id')
  async removeComment(@Param('id') id: string) {
    await this.productsService.removeComment(id);
    return {
      success: true,
      message: 'Comment deleted',
    };
  }
}
