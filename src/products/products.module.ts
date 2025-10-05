import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';
import { ProductsEntity } from 'src/entities/products.entity';
import { ProductsCommentEntity } from 'src/entities/productsComment.entity';
import { ProductsLikeEntity } from 'src/entities/productsLike.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      ProductsCommentEntity,
      ProductsLikeEntity,
      AdminEntity,
    ]),
  ],
  providers: [
    ProductsService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
