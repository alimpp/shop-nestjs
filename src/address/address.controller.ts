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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('address')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/all/admin')
  async getAllAddresses(@Request() req) {
    if (req.user.role != 'admin')
      throw new NotFoundException('Not Found Exception');
    return await this.addressService.getAllAddress();
  }

  @Get('/all/user')
  async getUserAddresses(@Request() req) {
    return await this.addressService.getUserAddress(req.user.id);
  }

  @Post('/add')
  async createAddress(@Body() body: CreateDto, @Request() req) {
    return await this.addressService.add({ ...body, userId: req.user.id });
  }

  @Get(':id')
  async getAddressByUserId(@Param('id') id: string) {
    return await this.addressService.getUserAddress(id);
  }

  @Patch('/set-default/:id')
  async setDefault(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @Request() req,
  ) {
    const userId = req.user.id;

    const userAddresses = await this.addressService.getUserAddress(userId);

    const existingDefault = userAddresses.find((item) => item.default === true);

    if (existingDefault) {
      await this.addressService.update(existingDefault.id, { default: false });
    }

    const updatedAddress = await this.addressService.update(id, updateDto);

    if (!updatedAddress) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return updatedAddress;
  }

  @Patch(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @Request() req,
  ) {
    const address = await this.addressService.update(id, updateDto);
    if (!address)
      throw new NotFoundException(`Address with id ${id} not found`);
    return address;
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string, @Request() req) {
    const address = this.addressService.remove(id);
    if (!address)
      throw new NotFoundException(`Address with id ${id} not found`);
    return address;
  }
}
