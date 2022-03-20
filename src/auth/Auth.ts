import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 50)
    password: string;
}

export class PostAuthDto {
    constructor(token: string) {
        this.token = token;
    }
    @IsString()
    token: string;
}
