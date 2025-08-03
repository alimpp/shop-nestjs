import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    
    @UseGuards(JwtAuthGuard)
    @Get('/all')
    async getAll() {
        return await this.adminService.getAll() 
    }
}
