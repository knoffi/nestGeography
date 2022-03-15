import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUsersService } from './IUsersService';
import { User } from './User';

@Injectable()
export class UsersService implements IUsersService {
    static users = [
        new User('69', 'Barney Stinson', 'awesome@gnb.com'),
        new User('42', 'Hitchhiker', 'through@the-galaxy.com'),
        new User('17', 'Michael Spivak', 'calculus@analysis.com'),
        new User('123', 'Max Mustermann', 'mymail@service.com'),
    ];
    allUsers = () => UsersService.users;
    getUser = (id: string) => {
        const user = UsersService.users.find((user) => user.id === id);
        if (user) {
            return user;
        } else {
            return new HttpException('User Id Not Found', HttpStatus.NOT_FOUND);
        }
    };
}
