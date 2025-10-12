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

  @UseGuards(JwtAuthGuard)
  @Post('/user/data')
  async getUserData(@Body() body: { userId: string }, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const result = await this.usersDataService.getUserDataById(body.userId);
    if (result) {
      return {
        data: result,
        message: null,
        error: null,
      };
    } else {
      return {
        data: null,
        message: 'No Data',
        error: 'This user not data in data base',
      };
    }
  }

  @Post('/save/user/data')
  async saveUserData(@Body() body: { userId: string; os: string }) {
    if (body.userId) {
      const userData = await this.usersDataService.getUserDataById(body.userId);
      if (userData) {
        await this.usersDataService.removeUserData(userData.id);
        return await this.usersDataService.saveUserData(body);
      } else {
        return await this.usersDataService.saveUserData(body);
      }
    } else {
      return await this.usersDataService.saveUserData(body);
    }
  }
}
