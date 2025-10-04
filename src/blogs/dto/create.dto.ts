import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SectionDto {
  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsString()
  description: string;

  @IsString()
  image: string;
}

export class TagDto {
  @IsString()
  name: string;
}

export class CreateDto {
  @IsNumber()
  like: number;

  @IsNumber()
  comment: number;

  @IsNumber()
  readingTime: number;

  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  @IsOptional()
  sections: SectionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  @IsOptional()
  tags: TagDto[];
}
