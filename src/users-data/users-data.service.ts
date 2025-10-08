import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersDataEntity } from 'src/entities/usersData.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersDataService {
  constructor(
    @InjectRepository(UsersDataEntity)
    private readonly usersDataRepo: Repository<UsersDataEntity>,
  ) {}

  async getAllUsersData() {
    return await this.usersDataRepo.find();
  }

  async getUserDataById(userId: string) {
    return await this.usersDataRepo.findOne({ where: { userId } });
  }

  async saveUserData(body: { userId: string; os: string }) {
    const data = this.usersDataRepo.create(body);
    return await this.usersDataRepo.save(data);
  }

  async updateUserData(body: { userId: string; os: string }) {
    return await this.usersDataRepo.update(body.userId, body);
  }
}
