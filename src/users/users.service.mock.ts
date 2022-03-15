import { IUserService } from './IUsersService';
import { User } from './User';
import { UsersService } from './users.service';

export class UsersServiceMock implements IUserService {
    allUsers = () => UsersService.users;
    getUser = (id: string) =>
        new User('1234', 'Max Mustermann', 'muster@mail.de');
}
