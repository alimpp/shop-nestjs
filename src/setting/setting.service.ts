import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingEntity } from '../entities/setting.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
  ) {}

  async create(createSettingDto: CreateDto): Promise<SettingEntity> {
    const setting = this.settingRepository.create(createSettingDto);
    return await this.settingRepository.save(setting);
  }

  async findAll(): Promise<SettingEntity[]> {
    return await this.settingRepository.find();
  }

  async findOne(id: string): Promise<SettingEntity> {
    const setting = await this.settingRepository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
    return setting;
  }

  async update(
    id: string,
    updateSettingDto: UpdateDto,
  ): Promise<SettingEntity> {
    const setting = await this.findOne(id);
    Object.assign(setting, updateSettingDto);
    return await this.settingRepository.save(setting);
  }

  async remove(id: string): Promise<void> {
    const setting = await this.findOne(id);
    await this.settingRepository.remove(setting);
  }
}
