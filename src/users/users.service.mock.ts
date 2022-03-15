import { IUsersService } from './IUsersService';
import { User } from './User';
import { UsersService } from './users.service';

export class UsersServiceMock implements IUsersService {
    static mocks = {
        user: new User('1234', 'Max Mustermann', 'muster@mail.de'),
    };
    allUsers = () => UsersService.users;
    getUser = () => UsersServiceMock.mocks.user;
}
