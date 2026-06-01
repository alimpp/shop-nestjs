import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SettingEntity } from '../entities/setting.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { SettingService } from './setting.service';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  create(@Body() createSettingDto: CreateDto): Promise<SettingEntity> {
    return this.settingService.create(createSettingDto);
  }

  @Get()
  findAll(): Promise<SettingEntity[]> {
    return this.settingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SettingEntity> {
    return this.settingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateDto,
  ): Promise<SettingEntity> {
    return this.settingService.update(id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.settingService.remove(id);
  }
}
