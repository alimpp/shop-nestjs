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
import { BannersService } from './banners.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('banners')
@UseGuards(JwtAuthGuard)
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly adminService: AdminService,
  ) {}

  @Get('/all')
  async getAllItems() {
    return await this.bannersService.getAll();
  }

  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.bannersService.add(body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastData = await this.bannersService.findById(id);
    if (!lastData)
      throw new NotFoundException(`Banner with id ${id} not found`);
    await this.bannersService.update(id, body);
    return {
      success: true,
      message: 'Banner updated successfully',
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
    const lastData = await this.bannersService.findById(id);
    if (!lastData)
      throw new NotFoundException(`Banner with id ${id} not found`);
    await this.bannersService.update(id, body);
    return {
      success: true,
      message: 'Banner updated successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const target = await this.bannersService.findById(id);
    if (!target) throw new NotFoundException(`Hero with id ${id} not found`);
    await this.bannersService.remove(id);
    return {
      success: true,
      message: 'Banner deleted',
    };
  }
}
