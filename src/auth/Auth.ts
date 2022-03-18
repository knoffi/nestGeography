import { IsString, Length } from 'class-validator';

export class ConfirmAuthDto {
    @IsString()
    @Length(3, 100)
    name: string;

    @IsString()
    @Length(8, 50)
    password: string;
}

export class PostAuthDto {
    @IsString()
    token: string;
}
