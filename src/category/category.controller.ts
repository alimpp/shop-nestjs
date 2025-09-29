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
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly adminService: AdminService,
  ) {}

  @Get('/history')
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

  @Patch('/name/:id')
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
