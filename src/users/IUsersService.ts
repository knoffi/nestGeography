import { HttpException } from '@nestjs/common';
import { CreateUserDto, User } from './User';

export interface IUsersService {
    allUsers: () => User[];
    getUser: (id: string) => User | HttpException;
    create: (newUser: CreateUserDto) => User | HttpException;
}
