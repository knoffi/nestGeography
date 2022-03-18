import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 50)
    password: string;
}

export class PostAuthDto {
    @IsString()
    token: string;
}
