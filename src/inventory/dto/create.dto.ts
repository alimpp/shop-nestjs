import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateDto {
  @IsString()
  @Length(2, 30)
  name: string;

  @IsString()
  @Length(15, 60)
  address: string;

  @IsString()
  @Length(10, 10)
  postalCode: string;

  @IsNumber()
  size: number;

  @IsNumber()
  @IsOptional()
  quantity: number;
}

export class InvenotryProductsCreateDto {
  @IsString()
  inventoryId: string;

  @IsString()
  productId: string;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  productName: number;

  @IsString()
  productSlug: number;
}
