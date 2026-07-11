import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

import { ProductMedia } from './entities/product-media.entity';
import { ProductTag } from './entities/product-tag.entity';
import { ProductVariantValue } from './entities/product-variant-value.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';

import { Brand } from './entities/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductMedia,
      ProductVariant,
      ProductVariantValue,
      ProductTag,
      Brand,
    ]),
  ],

  controllers: [
    ProductController,
  ],

  providers: [
    ProductService,
  ],

  exports: [
    ProductService,
  ],
})
export class ProductModule {}