import { IsString, Length } from 'class-validator';

export class SendDto {
  @IsString()
  chatId: string;

  @IsString()
  type: string;

  @IsString()
  content: string;

}