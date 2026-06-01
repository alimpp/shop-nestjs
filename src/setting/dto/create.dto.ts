import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  background!: string;

  @IsString()
  @IsNotEmpty()
  lang!: string;
}
