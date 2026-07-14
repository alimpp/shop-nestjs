import { IsEnum } from 'class-validator';

import { ProductStatus } from '../enums/product-status.enum';

export class ChangeProductStatusDto {
  @IsEnum(ProductStatus)
  status!: ProductStatus;
}
