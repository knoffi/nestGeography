import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
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
export class CreateUserPartialDto implements Partial<Omit<IUser, 'id'>> {
    @IsOptional()
    @IsString()
    @Length(3, 100)
    name: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
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

    updatedCopy(updates: Partial<User>) {
        return new User(
            updates.name || this.name,
            updates.email || this.name,
            updates.password || this.password
        );
    }

    static stubBuild(partialUser: Partial<User>): User {
        const stubUser = new User(
            partialUser.name || 'Testo McTesting',
            partialUser.email || 'tester@gmail.com',
            partialUser.password || 'secret'
        );
        stubUser.id = '12';
        return stubUser;
    }
}
