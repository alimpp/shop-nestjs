import { IsString, Length } from 'class-validator';

export class CreateDto {
  @IsString()
  @Length(10, 50)
  title: string;

  @IsString()
  @Length(10, 100)
  subTitle: string;

  @IsString()
  @Length(30, 500)
  descrption: string;

  @IsString()
  imageId: string;
}
