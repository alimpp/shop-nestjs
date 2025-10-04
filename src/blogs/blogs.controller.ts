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
import { BlogsService } from './blogs.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly adminService: AdminService,
  ) {}
  @Get('/all')
  async getAllItems() {
    return await this.blogsService.getAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.blogsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.blogsService.add(body);
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
    const lastData = await this.blogsService.findById(id);
    if (!lastData) throw new NotFoundException(`Blog with id ${id} not found`);
    await this.blogsService.update(id, body);
    return {
      success: true,
      message: 'Blog updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const target = await this.blogsService.findById(id);
    if (!target) throw new NotFoundException(`Hero with id ${id} not found`);
    await this.blogsService.remove(id);
    return {
      success: true,
      message: 'Blog deleted',
    };
  }

  @Get('/all-likes/:id')
  async getAllLike(@Param('id') blogId: string) {
    return await this.blogsService.getAllLike(blogId);
  }

  @Post('/like')
  async liked(@Body() body: { blogId: string }, @Request() req) {
    const targetBlog = await this.blogsService.findById(body.blogId);
    if (!targetBlog) {
      throw new NotFoundException('Blog not found');
    }
    const existingLike = await this.blogsService.findLikeById({
      blogId: body.blogId,
      likedBy: req.user.id,
    });
    if (existingLike) {
      throw new ConflictException('You have already liked this blog');
    }
    await this.blogsService.update(body.blogId, {
      like: targetBlog.like + 1,
    });
    return await this.blogsService.liked({
      blogId: body.blogId,
      likedBy: req.user.id,
    });
  }

  @Post('/dis-like')
  async disLike(@Body() body: { blogId: string }, @Request() req) {
    const targetBlog = await this.blogsService.findById(body.blogId);
    if (!targetBlog) {
      throw new NotFoundException('Blog not found');
    }
    const existingLike = await this.blogsService.findLikeById({
      blogId: body.blogId,
      likedBy: req.user.id,
    });
    if (existingLike) {
      throw new ConflictException('You have already liked this blog');
    }
    await this.blogsService.update(body.blogId, {
      like: targetBlog.like - 1,
    });
    return await this.blogsService.disLike(body.blogId);
  }
}
