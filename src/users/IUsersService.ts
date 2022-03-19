import { ConfirmAuthDto } from './../auth/Auth';
import { CreateUserDto, User } from './users.entity';
import { UsersServiceErrors } from './users.service.errors';

export interface IUsersService {
    allUsers: () => Promise<User[]>;
    getUser: (id: string) => Promise<User | UsersServiceErrors.idNotFound>;
    create: (
        newUser: CreateUserDto
    ) => Promise<User | UsersServiceErrors.doubleEmail>;
    delete: (id: string) => Promise<void | UsersServiceErrors.idNotFound>;
    update: (
        id: string,
        updates: Partial<CreateUserDto>
    ) => Promise<
        | User
        | UsersServiceErrors.doubleEmail
        | UsersServiceErrors.idNotFound
        | UsersServiceErrors.emptyUpdate
    >;
    confirm: (login: ConfirmAuthDto) => Promise<boolean>;
}
