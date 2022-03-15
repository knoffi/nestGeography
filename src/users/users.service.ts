import { Injectable } from '@nestjs/common';
import { IUserService } from './IUsersService';
import { users } from './User';

@Injectable()
export class UsersService implements IUserService {
    allUsers = () => users;
}
