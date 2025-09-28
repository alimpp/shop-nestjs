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
import { HeroService } from './hero.service';

@Controller('hero')
@UseGuards(JwtAuthGuard)
export class HeroController {
  constructor(
    private readonly heroService: HeroService,
    private readonly adminService: AdminService,
  ) {}

  @Get('/all')
  async getAllItems() {
    return await this.heroService.getAll();
  }

  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.heroService.add(body);
  }

  @Post('/actived')
  async actived(@Body() body: { heroId: string }, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.heroService.actived(body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');

    const targetHero = await this.heroService.findById(id);
    if (!targetHero)
      throw new NotFoundException(`Hero with id ${id} not found`);

    await this.heroService.update(id, body);

    return {
      success: true,
      message: 'Hero updated successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');

    const targetHero = await this.heroService.findById(id);
    if (!targetHero)
      throw new NotFoundException(`Hero with id ${id} not found`);

    await this.heroService.remove(id);

    return {
      success: true,
      message: 'Hero deleted',
    };
  }
}
