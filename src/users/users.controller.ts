import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllUsers(@Req() req) {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserProfile(@Req() req) {
    const user = await this.usersService.getUserById(req.user.id);
    if(!user) throw new NotFoundException(`This user with id ${req.user.id} bot found`)
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Req() req, @Param('id') id: string) {
    const user = await this.usersService.getUserById(req.user.id);
    if(!user) throw new NotFoundException(`This user with id ${id} bot found`)
    return await this.usersService.getUserById(id);
  }

  @Post('/register')
  async register(@Body() body: CreateDto) {
    return await this.usersService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async update(@Req() req, @Body() body: UpdateUserDto) {
    return await this.usersService.updateUser(req.user.id, body);
  }
}
