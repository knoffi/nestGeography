import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { IUsersService } from './IUsersService';
import { CreateUserDto, User } from './users.entity';

@Injectable()
export class UsersService implements IUsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {
        this.repository.clear();
        this.fillRepo();
    }
    fillRepo = async () => {
        try {
            const repoEmpty = (await this.repository.count()) === 0;
            if (repoEmpty) {
                this.repository.save(UsersService.users);
            }
        } catch (e) {
            console.log(e);
        }
    };
    getValidID = async () => {
        try {
            const user = this.repository.findOne();
            return (await user).id;
        } catch (e) {
            console.log(e);
        }
    };
    allUsers = async () => {
        try {
            return await this.repository.find();
        } catch (e) {
            console.log(e);
        }
    };
    getUser = async (id: string) => {
        try {
            const condition: FindManyOptions<User> = { where: { id } };
            const user = await this.repository.findOne(condition);
            if (user) {
                return user;
            } else {
                return new HttpException(
                    'User Id Not Found',
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (e) {
            console.log(e);
        }
    };
    create = (newUser: CreateUserDto) => {
        const emailAlreadyInUse = UsersService.users.some(
            (user) => user.email === newUser.email
        );
        if (emailAlreadyInUse) {
            return new HttpException(
                'Email already exists!',
                HttpStatus.CONFLICT
            );
        } else {
            const usedIDs = UsersService.users.map((user) => user.id);
            const newID = new Array(UsersService.users.length)
                .fill(1)
                .map((undefined, index) => index.toString())
                .find((entry) => !usedIDs.includes(entry));
            const creation = new User(
                newUser.name,
                newUser.email,
                newUser.password
            );
            UsersService.users.push(creation);
            return creation;
        }
    };
    static users = [
        new User('Barney Stinson', 'awesome@gnb.com', { pw: 'default' }),
        new User('Hitchhiker', 'through@the-galaxy.com', {
            pw: 'default',
        }),
        new User('Michael Spivak', 'calculus@analysis.com', {
            pw: 'default',
        }),
        new User('Max Mustermann', 'mymail@service.com', {
            pw: 'default',
        }),
        new User('Perry Mc Guffin', 'mcguffin@yahoo.com', {
            pw: 'default',
        }),
    ];
}
