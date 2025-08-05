import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';

import { CreateDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getUserByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(body: CreateDto) {
    const user = this.userRepository.create(body);
    return await this.userRepository.save(user);
  }

  async updateUser(id: string, body: UpdateUserDto) {
    return await this.userRepository.update(id, body);
  }
}
