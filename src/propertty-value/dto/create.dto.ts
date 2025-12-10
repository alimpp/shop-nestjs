import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateDto {
  @IsString()
  @Length(2, 20)
  name: string;

  @IsString()
  properttyId: string;

  @IsBoolean()
  trash: boolean;
}
