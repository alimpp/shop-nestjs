import {
    IsBoolean,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
    ProductStatus,
} from '../enums/product-status.enum';


export class QueryProductDto {


  @IsOptional()
  @IsString()
  search?: string;


  @IsOptional()
  @IsUUID()
  categoryId?: string;


  @IsOptional()
  @IsUUID()
  brandId?: string;



  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;



  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;



  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;



  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;



  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;



  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;



  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;



  @IsOptional()
  @IsString()
  @IsIn([
    'createdAt',
    'updatedAt',
    'name',
    'price',
    'status',
    'stock',
    'soldCount',
    'viewCount',
  ])
  sortBy?: string;



  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

}
