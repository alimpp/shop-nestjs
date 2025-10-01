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
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ServicesService } from './services.service';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly adminService: AdminService,
  ) {}

  @Get('/all')
  async getAllItems() {
    return await this.servicesService.getAll();
  }

  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.servicesService.add(body);
  }

  @Patch('/name/:id')
  async updateName(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastData = await this.servicesService.findById(id);
    if (!lastData) throw new NotFoundException(`Brand with id ${id} not found`);
    await this.servicesService.update(id, body);
    return {
      success: true,
      message: 'Service item updated successfully',
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
    const lastData = await this.servicesService.findById(id);
    if (!lastData) throw new NotFoundException(`Brand with id ${id} not found`);
    await this.servicesService.update(id, body);
    return {
      success: true,
      message: 'Service item updated successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const target = await this.servicesService.findById(id);
    if (!target) throw new NotFoundException(`Hero with id ${id} not found`);
    await this.servicesService.remove(id);
    return {
      success: true,
      message: 'Service item deleted',
    };
  }
}
