import { HttpException } from '@nestjs/common';
import { ConfirmAuthDto } from './../auth/Auth';
import { CreateUserDto, User } from './users.entity';

export interface IUsersService {
    allUsers: () => Promise<User[]>;
    getUser: (id: string) => Promise<User | HttpException>;
    create: (newUser: CreateUserDto) => Promise<User | HttpException>;
    delete: (id: string) => Promise<void | HttpException>;
    update: (
        id: string,
        updates: Partial<CreateUserDto>
    ) => Promise<User | HttpException>;
    confirm: (login: ConfirmAuthDto) => Promise<boolean>;
}
