import { IsEmail, IsString, Length } from 'class-validator';
export class UpdateUserDto {
    @IsString()
    @Length(3, 30)
    fristname: string;

    @IsString()
    @Length(3, 30)
    lastname: string;

    @IsEmail()
    email: string;

    @IsString()
    avatarUrl: string;
}
