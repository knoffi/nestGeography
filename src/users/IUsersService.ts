import { HttpException } from '@nestjs/common';
import { CreateUserDto, User } from './users.entity';

export interface IUsersService {
    allUsers: () => Promise<User[]>;
    getUser: (id: string) => Promise<User | HttpException>;
    create: (newUser: CreateUserDto) => User | HttpException;
    //REMOVE after tests are fixed
    postRandomUser: () => Promise<void>;
}
