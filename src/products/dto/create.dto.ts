import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class InfoDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CategoryDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  imageId: string;

  @IsString()
  iconId: string;
}

export class PropertyDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class PropertyValueDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  properttyId: string;
}

export class TagsDto {
  @IsString()
  name: string;
}

export class RelatedBlogsDto {
  @IsString()
  blogId: string;

  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsString()
  description: string;

  @IsString()
  image: string;
}

export class ImagesDto {
  imageId: string;
}

export class CreateDto {
  @IsString()
  @IsOptional()
  submiter: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  priceAfterDiscount: number;

  @IsNumber()
  likes: number;

  @IsNumber()
  comments: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InfoDto)
  @IsOptional()
  info: InfoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @IsOptional()
  category: CategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  @IsOptional()
  property: PropertyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyValueDto)
  @IsOptional()
  property_value: PropertyValueDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagsDto)
  @IsOptional()
  tags: TagsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelatedBlogsDto)
  @IsOptional()
  relatedBlogs: RelatedBlogsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImagesDto)
  @IsOptional()
  images: ImagesDto[];
}
