import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ButtonDto {
  @IsString()
  type!: string;

  @IsString()
  radius!: string;

  @IsString()
  background!: string;

  @IsString()
  color!: string;

  @IsString()
  border!: string;
}

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  background!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  lang!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ButtonDto)
  @IsOptional()
  button!: ButtonDto[];
}
