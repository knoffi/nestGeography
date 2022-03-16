import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUsersService } from './IUsersService';
import { User } from './User';

@Injectable()
export class UsersService implements IUsersService {
    static users = [
        new User('69', 'Barney Stinson', 'awesome@gnb.com', { pw: 'default' }),
        new User('42', 'Hitchhiker', 'through@the-galaxy.com', {
            pw: 'default',
        }),
        new User('17', 'Michael Spivak', 'calculus@analysis.com', {
            pw: 'default',
        }),
        new User('123', 'Max Mustermann', 'mymail@service.com', {
            pw: 'default',
        }),
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
    create = (newUser: Omit<User, 'id'>) => {
        const usedIDs = UsersService.users.map((user) => user.id);
        const newID = new Array(UsersService.users.length)
            .fill(1)
            .map((undefined, index) => index.toString())
            .find((entry) => !usedIDs.includes(entry));
        const creation = new User(
            newID,
            newUser.name,
            newUser.email,
            newUser.password
        );
        UsersService.users.push(creation);
        return creation;
    };
}
