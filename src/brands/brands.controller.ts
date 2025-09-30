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
import { BrandsService } from './brands.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly adminService: AdminService,
  ) {}

  @Get('/all')
  async getAllItems() {
    return await this.brandsService.getAll();
  }

  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.brandsService.add(body);
  }

  @Patch('/name/:id')
  async updateName(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastData = await this.brandsService.findById(id);
    if (!lastData) throw new NotFoundException(`Brand with id ${id} not found`);
    await this.brandsService.update(id, body);
    return {
      success: true,
      message: 'Brand updated successfully',
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
    const lastData = await this.brandsService.findById(id);
    if (!lastData) throw new NotFoundException(`Brand with id ${id} not found`);
    await this.brandsService.update(id, body);
    return {
      success: true,
      message: 'Brand updated successfully',
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
    const lastData = await this.brandsService.findById(id);
    if (!lastData) throw new NotFoundException(`Brand with id ${id} not found`);
    await this.brandsService.update(id, body);
    return {
      success: true,
      message: 'Brand updated successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const targetHero = await this.brandsService.findById(id);
    if (!targetHero)
      throw new NotFoundException(`Hero with id ${id} not found`);
    await this.brandsService.remove(id);
    return {
      success: true,
      message: 'Brand deleted',
    };
  }
}
