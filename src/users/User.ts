import { IsEmail, IsInt, IsString, Length } from 'class-validator';

export class User {
    @IsInt()
    id: number;
    @IsString()
    @Length(3, 100)
    name: string;
    @IsEmail()
    email: string;
    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

export const users: User[] = [
    new User(69, 'Barney Stinson', 'awesome@gnb.com'),
    new User(42, 'Hitchhiker', 'through@the-galaxy.com'),
    new User(17, 'Michael Spivak', 'calculus@analysis.com'),
    new User(123, 'Max Mustermann', 'mymail@service.com'),
];
