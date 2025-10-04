import { Module, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryHistoryEntity } from 'src/entities/categoryHistory.entity';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      CategoryHistoryEntity,
      AdminEntity,
    ]),
  ],
  providers: [
    CategoryService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [CategoryController]
})

export class CategoryModule {}
