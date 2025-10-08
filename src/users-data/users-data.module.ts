import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';
import { UsersDataEntity } from 'src/entities/usersData.entity';
import { UsersDataController } from './users-data.controller';
import { UsersDataService } from './users-data.service';
@Module({
  imports: [TypeOrmModule.forFeature([UsersDataEntity, AdminEntity])],
  providers: [
    UsersDataService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [UsersDataController],
})
export class UsersDataModule {}
