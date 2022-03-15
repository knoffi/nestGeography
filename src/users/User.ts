import { IsEmail, IsString, Length } from 'class-validator';

export class User {
    @IsString()
    id: string;
    @IsString()
    @Length(3, 100)
    name: string;
    @IsEmail()
    email: string;
    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
