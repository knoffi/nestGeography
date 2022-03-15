import { User } from './User';

export interface IUserService {
    allUsers: () => User[];
}
