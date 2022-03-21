import { ConfirmAuthDto } from 'src/auth/Auth';
import { IUsersService } from './IUsersService';
import { CreateUserDto, User } from './users.entity';

export class UsersServiceMock implements IUsersService {
    confirm: (login: ConfirmAuthDto) => Promise<true>;
    delete: (id: string) => Promise<void>;
    update: (id: string, updates: Partial<CreateUserDto>) => Promise<User>;
    private static stubUser = new User('Max Mustermann', 'muster@mail.de', {
        pw: 'default',
    });
    static stubs = {
        user: UsersServiceMock.stubUser,
        allUsers: [UsersServiceMock.stubUser],
    };
    create = async (newUser: CreateUserDto) => {
        const creation = User.stubBuild(newUser);
        UsersServiceMock.stubs.allUsers.push(creation);
        return creation;
    };
    allUsers = async () => UsersServiceMock.stubs.allUsers;
    getUser = async (id: string) => UsersServiceMock.stubs.user;
    allUsersByEmail: (emailSubstring: string) => Promise<User[]>;
}
