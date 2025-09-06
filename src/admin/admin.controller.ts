import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { AdminService } from './admin.service';

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
