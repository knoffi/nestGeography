import { IUsersService } from './IUsersService';
import { CreateUserDto, User } from './users.entity';

export class UsersServiceMock implements IUsersService {
    private static stubUser: User = new User(
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
    allUsers = async () => UsersServiceMock.stubs.allUsers;
    getUser = async (id: string) => UsersServiceMock.stubs.user;
}
