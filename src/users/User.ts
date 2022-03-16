import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class User {
    @IsString()
    id: string;
    @IsString()
    @Length(3, 100)
    name: string;
    @IsEmail()
    email: string;
    @Exclude()
    @IsString()
    @Length(8, 50)
    password: string;
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
