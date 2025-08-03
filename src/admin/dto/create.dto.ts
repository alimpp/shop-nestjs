import { IsString, Length } from 'class-validator';

export class CreateDto {
  @IsString()
  @Length(5, 20)
  role: string;

  @IsString()
  @Length(10, 30)
  username: string;

  @IsString()
  @Length(10, 30)
  password: string;
}