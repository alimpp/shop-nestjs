import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll() {
    return await this.adminService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async getAdmin(@Req() req) {
    return await this.adminService.getAdmin(req.user.id);
  }
}
