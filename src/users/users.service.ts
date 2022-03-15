import { Injectable } from '@nestjs/common';
import { IUserService } from './IUsersService';
import { User } from './User';

@Injectable()
export class UsersService implements IUserService {
    static users = [
        new User('69', 'Barney Stinson', 'awesome@gnb.com'),
        new User('42', 'Hitchhiker', 'through@the-galaxy.com'),
        new User('17', 'Michael Spivak', 'calculus@analysis.com'),
        new User('123', 'Max Mustermann', 'mymail@service.com'),
    ];
    allUsers = () => UsersService.users;
    getUser = (id: string) => UsersService.users.find((user) => user.id === id);
}
