import { IUsersService } from './IUsersService';
import { CreateUserDto, User } from './User';

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
    create = (newUser: CreateUserDto) => {
        const creation = User.stubBuild(newUser);
        UsersServiceMock.stubs.allUsers.push(creation);
        return creation;
    };
    allUsers = () => UsersServiceMock.stubs.allUsers;
    getUser = (id: string) => UsersServiceMock.stubs.user;
}
