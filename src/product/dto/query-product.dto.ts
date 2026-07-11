import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
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
  page?: number = 1;



  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;



  @IsOptional()
  @IsString()
  sortBy?: string;



  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

}