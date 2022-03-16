import { HttpException } from '@nestjs/common';
import { User } from './User';

export interface IUsersService {
    allUsers: () => User[];
    getUser: (id: string) => User | HttpException;
    create: (newUser: Omit<User, 'id'>) => User | HttpException;
}
