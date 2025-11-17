import { IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  user: string;

  @IsString()
  theme: string;

  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsString()
  descrption: string;

  @IsString()
  text: string;

  @IsString()
  label: string;

  @IsString()
  date: string;
}
