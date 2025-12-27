import {
  Body,
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
import { CategoryService } from './category.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly adminService: AdminService,
  ) {}

  @Get('/history')
  @UseGuards(JwtAuthGuard)
  async getAllHistory() {
    const historyList = await this.categoryService.allHistory();
    const result = await Promise.all(
      historyList.map(async (item) => {
        const admin = await this.adminService.findAdminById(item.submiter);
        return {
          ...item,
          submiter: admin?.username || item.submiter,
        };
      }),
    );
    return result;
  }

  @Get('/all')
  async getAllCategory() {
    const categories = await this.categoryService.getAll();
    const result = await Promise.all(
      categories.map(async (category) => {
        const submiter = await this.adminService.findAdminById(
          category.submiter,
        );
        return {
          ...category,
          imageId: category.imageId,
          iconId: category.iconId,
          id: category.id,
          name: category.name,
          created_at: category.created_at,
          submiter: submiter?.username || '',
        };
      }),
    );
    return result;
  }

  @Get('/trash')
  async getAllTrashCategory() {
    const categories = await this.categoryService.getAllTrash();
    const result = await Promise.all(
      categories.map(async (category) => {
        const submiter = await this.adminService.findAdminById(
          category.submiter,
        );
        return {
          ...category,
          imageId: category.imageId,
          iconId: category.iconId,
          id: category.id,
          name: category.name,
          created_at: category.created_at,
          submiter: submiter?.username || '',
        };
      }),
    );
    return result;
  }

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const newCategory = await this.categoryService.add({
      ...body,
      submiter: req.user.id,
    });
    await this.categoryService.createHistory({
      submiter: req.user.id,
      content: `Category ${newCategory.name} created`,
    });
    return newCategory;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastCategoryData = await this.categoryService.findById(id);
    if (!lastCategoryData)
      throw new NotFoundException(`Category with id ${id} not found`);
    await this.categoryService.update(id, body);
    await this.categoryService.createHistory({
      submiter: req.user.id,
      content: `Category Updated`,
    });
    return {
      success: true,
      message: 'Category updated successfully',
    };
  }

  @Patch('/trash/:id')
  @UseGuards(JwtAuthGuard)
  async trash(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastCategoryData = await this.categoryService.findById(id);
    if (!lastCategoryData)
      throw new NotFoundException(`Category with id ${id} not found`);
    await this.categoryService.update(id, body);
    return {
      success: true,
      message: 'Trash successfully',
    };
  }

  @Patch('/name/:id')
  @UseGuards(JwtAuthGuard)
  async updateName(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastCategoryData = await this.categoryService.findById(id);
    if (!lastCategoryData)
      throw new NotFoundException(`Category with id ${id} not found`);
    await this.categoryService.update(id, body);
    await this.categoryService.createHistory({
      submiter: req.user.id,
      content: `Category ${lastCategoryData.name} changed to ${body.name}`,
    });
    return {
      success: true,
      message: 'Category updated successfully',
    };
  }

  @Patch('/image/:id')
  @UseGuards(JwtAuthGuard)
  async updateImage(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastCategoryData = await this.categoryService.findById(id);
    if (!lastCategoryData)
      throw new NotFoundException(`Category with id ${id} not found`);
    await this.categoryService.update(id, body);
    await this.categoryService.createHistory({
      submiter: req.user.id,
      content: `Category ${lastCategoryData.imageId} changed to ${body.imageId}`,
    });
    return {
      success: true,
      message: 'Category updated successfully',
    };
  }

  @Patch('/icon/:id')
  @UseGuards(JwtAuthGuard)
  async updateIcon(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastCategoryData = await this.categoryService.findById(id);
    if (!lastCategoryData)
      throw new NotFoundException(`Category with id ${id} not found`);
    await this.categoryService.update(id, body);
    await this.categoryService.createHistory({
      submiter: req.user.id,
      content: `Category ${lastCategoryData.iconId} changed to ${body.iconId}`,
    });
    return {
      success: true,
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastCategoryData = await this.categoryService.findById(id);
    if (!lastCategoryData)
      throw new NotFoundException(`Category with id ${id} not found`);
    await this.categoryService.remove(id);
    await this.categoryService.createHistory({
      submiter: req.user.id,
      content: `Category ${lastCategoryData.name} deleted`,
    });

    return {
      success: true,
      message: 'Category deleted',
    };
  }
}
