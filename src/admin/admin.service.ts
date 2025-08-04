import { Injectable } from '@nestjs/common';
import { AdminEntity } from 'src/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private readonly adminRepo: Repository<AdminEntity>
    ) {}

    async getAll() {
        return await this.adminRepo.find()
    }

    async findAdmin(username: string, password: string) {
        return await this.adminRepo.findOne({ 
            where: { 
                username: username,
                password: password 
            }
        })
    }

     async findAdminById(id: string) {
        return await this.adminRepo.findOne({ where: { id } })
    }
}
