import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { UsersDataService } from './users-data.service';

@Controller('users-data')
export class UsersDataController {
  constructor(
    private readonly usersDataService: UsersDataService,
    private readonly adminService: AdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all/users/data')
  async getAllUsersData(@Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.usersDataService.getAllUsersData();
  }

  @Post('/save/user/data')
  async saveUserData(@Body() body: { userId: string; os: string }) {
    if (body.userId) {
      const userData = await this.usersDataService.getUserDataById(body.userId);
      if (userData) return this.usersDataService.updateUserData(body);
      return await this.usersDataService.saveUserData(body);
    } else {
      return await this.usersDataService.saveUserData(body);
    }
  }
}
