import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
interface IUser {
    name: string;
    id: string;
    email: string;
    password: string;
}
export class CreateUserDto implements Omit<IUser, 'id'> {
    @IsString()
    @Length(3, 100)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 50)
    password: string;
}
export class GetUserDto implements Omit<IUser, 'password'> {
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    id: string;
}
export class User {
    @IsString()
    @Length(3, 100)
    name: string;

    @IsString()
    @Length(8, 50)
    @Exclude()
    password: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    id: string;

    constructor(
        id: string,
        name: string,
        email: string,
        password: { pw: 'default' } | string
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = typeof password === 'string' ? password : '123456789';
    }

    static stubBuild(partialUser: Partial<User>): User {
        return new User(
            partialUser.id || '1',
            partialUser.name || 'Testo McTesting',
            partialUser.email || 'tester@gmail.com',
            partialUser.password || 'secret'
        );
    }
}
