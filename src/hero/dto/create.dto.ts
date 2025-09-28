import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateDto {
  @IsString()
  @Length(10, 30)
  title: string;

  @IsString()
  @Length(10, 50)
  subTitle: string;

  @IsString()
  imageId: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  @Length(10, 200)
  descrption: string;
}
