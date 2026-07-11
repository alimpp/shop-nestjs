import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator';

import { MediaType } from '../enums/media-type.enum';


export class CreateProductMediaDto {


  @IsEnum(MediaType)
  type!: MediaType;


  @IsUrl()
  url!: string;


  @IsOptional()
  @IsString()
  @MaxLength(100)
  mimeType?: string;


  @IsOptional()
  @IsNumber()
  size?: number;


  @IsOptional()
  @IsString()
  alt?: string;


  @IsOptional()
  @IsBoolean()
  isThumbnail?: boolean;


  @IsOptional()
  sortOrder?: number;

}