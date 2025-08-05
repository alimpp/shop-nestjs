import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AdminService } from 'src/admin/admin.service';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly adminService: AdminService
    ) {}

    @Get('/history')
    async getAllHistory() {
      const historyList = await this.categoryService.allHistory();

      const result = await Promise.all(historyList.map(async (item) => {
        const admin = await this.adminService.findAdminById(item.submiter);
        return {
          ...item,
          submiter: admin?.username || item.submiter 
        };
      }));

      return result;
    }

    @Get('/all')
    async getAllCategory() {
      return await this.categoryService.getAll();
    }

    @Post('/add')
    async add(@Body() body: CreateDto,@Request() req) {    

      const admin = await this.adminService.findAdminById(req.user.id)    
      if(!admin) throw new UnauthorizedException('Unauthorized access');

      const newCategory = await this.categoryService.add({...body, submiter: req.user.id});
      await this.categoryService.createHistory({submiter: req.user.id, content: `Category ${newCategory.name} created`})

      return newCategory
    }

    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() body: UpdateDto,
      @Request() req
    ) {

      const admin = await this.adminService.findAdminById(req.user.id);
      if(!admin) throw new UnauthorizedException('Unauthorized access');

      const lastCategoryData = await this.categoryService.findById(id);
      if(!lastCategoryData) throw new NotFoundException(`Category with id ${id} not found`)

      await this.categoryService.update(id, body);
      await this.categoryService.createHistory({
        submiter: req.user.id,
        content: `Category ${lastCategoryData.name} changed to ${body.name}`
      });

      return {
        success: true,
        message: 'Category updated successfully'
      };
    }

    @Delete(':id')
    async delete(@Param('id') id: string,@Request() req) {

      const admin = await this.adminService.findAdminById(req.user.id)    
      if(!admin) throw new UnauthorizedException('Unauthorized access'); 

      const lastCategoryData = await this.categoryService.findById(id);
      if(!lastCategoryData) throw new NotFoundException(`Category with id ${id} not found`)

      await this.categoryService.remove(id);
      await this.categoryService.createHistory({
        submiter: req.user.id,
        content: `Category ${lastCategoryData.name} deleted`
      });

      return {
        success: true,
        message: 'Category deleted'
      };
    }
    
}
