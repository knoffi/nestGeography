import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmAuthDto } from 'src/auth/Auth';
import { Repository } from 'typeorm';
import { IUsersService } from './IUsersService';
import { CreateUserDto, User } from './users.entity';
import { UsersServiceErrors } from './users.service.errors';

@Injectable()
export class UsersService implements IUsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}
    confirm = async (login: ConfirmAuthDto) => {
        const userOfLogin = await this.repository.findOne({
            where: { ...login },
        });

        const loginFailed = !userOfLogin;
        if (loginFailed) {
            return false;
        } else {
            return true;
        }
    };
    update = async (id: string, updates: Partial<CreateUserDto>) => {
        const updateIsEmpty = Object.keys(updates).length === 0;
        if (updateIsEmpty) {
            return UsersServiceErrors.emptyUpdate;
        } else {
            //NOTE: can I update even if id is wrong? or do I get an exception?
            const oldUser = await this.repository.findOne(id);
            if (!oldUser) {
                return UsersServiceErrors.idNotFound;
            } else {
                const newEmailIsDouble =
                    updates.email && this.newEmailIsDouble(updates.email, id);
                if (newEmailIsDouble) {
                    return UsersServiceErrors.doubleEmail;
                } else {
                    await this.repository.update(id, updates);
                    return oldUser.updatedCopy(updates);
                }
            }
        }
    };

    private newEmailIsDouble = async (email: string, ignoreId: string) => {
        return (
            await this.repository.find({
                where: { email },
            })
        ).some((user) => user.id !== ignoreId);
    };

    fillRepo = async () => {
        try {
            const repoEmpty = !(await this.repository.findOne());
            if (repoEmpty) {
                await this.repository.save(UsersService.users);
            }
        } catch (e) {
            console.log(e);
        }
    };

    clear = async () => {
        await this.repository.clear();
    };

    getValidID = async () => {
        const user = await this.repository.findOne();
        if (user) {
            return user.id;
        } else {
            return UsersServiceErrors.emptyDB;
        }
    };
    allUsers = async () => await this.repository.find();

    getUser = async (id: string) =>
        (await this.repository.findOne(id)) || UsersServiceErrors.idNotFound;

    create = async (
        newUser: CreateUserDto
    ): Promise<User | UsersServiceErrors.doubleEmail> => {
        const creation = new User(
            newUser.name,
            newUser.email,
            newUser.password
        );
        const emailExistsAlready =
            (await this.repository.count({ where: { email: newUser.email } })) >
            0;
        if (emailExistsAlready) {
            return UsersServiceErrors.doubleEmail;
        } else {
            return await this.repository.save(creation);
        }
    };
    delete = async (
        id: string
    ): Promise<void | UsersServiceErrors.idNotFound> => {
        const deletionTarget = await this.repository.findOne({ where: { id } });
        if (deletionTarget) {
            await this.repository.remove(deletionTarget);
        } else {
            return UsersServiceErrors.idNotFound;
        }
    };
    static users = [
        new User('Barney Stinson', 'awesome@gnb.com', { pw: 'default' }),
        new User('Hitchhiker', 'through@the-galaxy.com', {
            pw: 'default',
        }),
        new User('Michael Spivak', 'calculus@analysis.com', {
            pw: 'default',
        }),
        new User('Max Mustermann', 'mymail@service.com', {
            pw: 'default',
        }),
        new User('Perry Mc Guffin', 'mcguffin@yahoo.com', {
            pw: 'default',
        }),
    ];
}
