import { IUsersService } from './IUsersService';
import { User } from './User';

export class UsersServiceMock implements IUsersService {
    private static stubUser: User = new User(
        '1234',
        'Max Mustermann',
        'muster@mail.de',
        {
            pw: 'default',
        }
    );
    static stubs = {
        user: UsersServiceMock.stubUser,
        allUsers: [UsersServiceMock.stubUser],
    };
    create = (newUser: Omit<User, 'id'>) => {
        const creation = User.stubBuild(newUser);
        UsersServiceMock.stubs.allUsers.push(creation);
        return creation;
    };
    allUsers = () => UsersServiceMock.stubs.allUsers;
    getUser = (id: string) => UsersServiceMock.stubs.user;
}
