import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UseGuards,
  Request
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

    @Get('/all')
    async getUserAddresses() {
      return await this.categoryService.getAll();
    }

    @Post('/add')
    async createAddress(@Body() body: CreateDto,@Request() req) {    
      const admin = await this.adminService.findAdminById(req.user.id)    
      if(!admin) throw new Error('Bad Access . . .') 
      return await this.categoryService.add({...body, submiter: req.user.id});
    }

    @Patch(':id')
    async updateAddress(@Param('id') id: string,@Body() updateDto: UpdateDto,@Request() req) {
      const admin = await this.adminService.findAdminById(req.user.id)    
      if(!admin) throw new Error('Bad Access . . .') 
      return await this.categoryService.update(id, updateDto);
    }

    @Delete(':id')
    async deleteAddress(@Param('id') id: string,@Request() req) {
      const admin = await this.adminService.findAdminById(req.user.id)    
      if(!admin) throw new Error('Bad Access . . .') 
      return await this.categoryService.remove(id);
    }
    
}
