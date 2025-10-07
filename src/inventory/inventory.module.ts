import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';
import { InvenotryEntity } from 'src/entities/inventory.entity';
import { InvenotryProductsEntity } from 'src/entities/inventoryProducts.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvenotryEntity,
      InvenotryProductsEntity,
      AdminEntity,
    ]),
  ],
  providers: [
    InventoryService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [InventoryController],
})
export class InventoryModule {}
