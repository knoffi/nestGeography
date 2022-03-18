import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmAuthDto } from 'src/auth/Auth';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { IUsersService } from './IUsersService';
import { CreateUserDto, User } from './users.entity';

@Injectable()
export class UsersService implements IUsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    confirm = async (login: ConfirmAuthDto) => {
        try {
            const userOfLogin = await this.repository.findOne({
                where: { ...login },
            });

            const loginFailed = !userOfLogin;
            if (loginFailed) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    };
    update = async (
        id: string,
        updates: Partial<CreateUserDto>
    ): Promise<User | HttpException> => {
        const updateIsEmpty = Object.keys(updates).length === 0;
        if (updateIsEmpty) {
            return new HttpException(
                'Empty updates are not allowed',
                HttpStatus.BAD_REQUEST
            );
        } else {
            const idExists =
                0 < (await this.repository.count({ where: { id: id } }));
            if (idExists) {
                try {
                    await this.repository.update({ id: id }, updates);
                    const updatedUser = await this.repository.findOne({
                        where: { id: id },
                    });
                    return updatedUser;
                } catch (e) {
                    if (
                        e instanceof QueryFailedError &&
                        e.message.match(
                            / UNIQUE constraint failed: user.email/i
                        )
                    ) {
                        return new HttpException(
                            'Email is already used',
                            HttpStatus.CONFLICT
                        );
                    }
                }
            } else {
                return new HttpException(
                    'Id not found',
                    HttpStatus.BAD_REQUEST
                );
            }
        }
    };
    fillRepo = async () => {
        try {
            const repoEmpty = (await this.repository.count()) === 0;
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
        try {
            const user = await this.repository.findOne();
            return user.id;
        } catch (e) {
            console.log(e);
        }
    };
    allUsers = async () => {
        try {
            return await this.repository.find();
        } catch (e) {
            console.log(e);
        }
    };
    getUser = async (id: string) => {
        try {
            const condition: FindManyOptions<User> = { where: { id } };
            const user = await this.repository.findOne(condition);
            if (user) {
                return user;
            } else {
                return new HttpException(
                    'User Id Not Found',
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (e) {
            console.log(e);
        }
    };
    create = async (newUser: CreateUserDto) => {
        const creation = new User(
            newUser.name,
            newUser.email,
            newUser.password
        );
        try {
            const savedCreation = await this.repository.save(creation);
            return savedCreation;
        } catch (e) {
            if (
                e instanceof QueryFailedError &&
                e.message.match(/UNIQUE constraint failed/i)
            ) {
                return new HttpException(
                    'Email is already used',
                    HttpStatus.CONFLICT
                );
            } else {
                console.log(e.name);
                console.log(e.message);
            }
        }
    };
    delete = async (id: string): Promise<void | HttpException> => {
        const deletionTarget = await this.repository.findOne({ where: { id } });
        if (deletionTarget) {
            await this.repository.remove(deletionTarget);
        } else {
            return new HttpException('Id not found', HttpStatus.NOT_FOUND);
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
