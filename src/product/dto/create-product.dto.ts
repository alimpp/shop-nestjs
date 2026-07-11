import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    MaxLength,
    Min,
} from 'class-validator';

import { ProductStatus } from '../enums/product-status.enum';
import { ProductVisibility } from '../enums/product-visibility.enum';

export class CreateProductDto {

  @IsString()
  @Length(3, 200)
  name!: string;


  @IsString()
  @Length(3, 220)
  slug!: string;


  @IsString()
  description!: string;


  @IsOptional()
  @IsString()
  shortDescription?: string;


  @IsString()
  @MaxLength(120)
  sku!: string;


  @IsOptional()
  @IsString()
  @MaxLength(120)
  barcode?: string;


  @IsNumber()
  @Min(0)
  price!: number;


  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;


  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;


  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;


  @IsOptional()
  @IsBoolean()
  manageStock?: boolean;


  @IsOptional()
  @IsBoolean()
  allowBackorder?: boolean;


  @IsOptional()
  @IsNumber()
  weight?: number;


  @IsOptional()
  @IsNumber()
  length?: number;


  @IsOptional()
  @IsNumber()
  width?: number;


  @IsOptional()
  @IsNumber()
  height?: number;


  @IsUUID()
  categoryId!: string;


  @IsOptional()
  @IsUUID()
  brandId?: string;


  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;


  @IsOptional()
  @IsEnum(ProductVisibility)
  visibility?: ProductVisibility;


  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;


  @IsOptional()
  @IsBoolean()
  isActive?: boolean;


  /*
  |--------------------------------------------------------------------------
  | SEO
  |--------------------------------------------------------------------------
  */


  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;


  @IsOptional()
  @IsString()
  metaDescription?: string;


  @IsOptional()
  @IsString()
  keywords?: string;


  @IsOptional()
  @IsString()
  canonical?: string;


  @IsOptional()
  @IsString()
  ogImage?: string;
}