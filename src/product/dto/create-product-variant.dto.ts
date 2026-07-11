import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';


export class CreateProductVariantDto {


  @IsString()
  sku!: string;


  @IsOptional()
  @IsString()
  barcode?: string;


  @IsNumber()
  @Min(0)
  price!: number;


  @IsOptional()
  @IsNumber()
  salePrice?: number;


  @IsOptional()
  @IsNumber()
  stock?: number;


  @IsOptional()
  @IsBoolean()
  isActive?: boolean;


  @IsOptional()
  @IsString()
  image?: string;

}