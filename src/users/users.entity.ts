import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @IsString()
    id: string;

    @Column()
    @IsString()
    @Length(3, 100)
    name: string;

    @Column()
    @IsString()
    @Length(8, 50)
    @Exclude()
    password: string;

    @Column({ unique: true })
    @IsString()
    @IsEmail()
    email: string;

    constructor(
        name: string,
        email: string,
        password: { pw: 'default' } | string
    ) {
        this.name = name;
        this.email = email;
        this.password = typeof password === 'string' ? password : '123456789';
    }

    static stubBuild(partialUser: Partial<User>): User {
        return new User(
            partialUser.name || 'Testo McTesting',
            partialUser.email || 'tester@gmail.com',
            partialUser.password || 'secret'
        );
    }
}
