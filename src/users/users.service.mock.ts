import { IUserService } from './IUsersService';
import { users } from './User';

export class UsersServiceMock implements IUserService {
    allUsers = () => users;
}
