import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateDto {
  @IsString()
  @Length(2, 20)
  name: string;

  @IsString()
  @Length(10, 100)
  content: string;

  @IsString()
  @Length(10, 10)
  postalCode: string;

  @IsBoolean()
  default: boolean;

  @IsBoolean()
  pin: boolean;
}
