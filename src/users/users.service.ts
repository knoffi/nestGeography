import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, map } from 'rxjs';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { IUsersService } from './IUsersService';
import { CreateUserDto, User } from './users.entity';

@Injectable()
//FRAGE: schau mal rein, ob die CRUD operationen halbwegs okayisch programmiert wurden (save vs insert etc.)
export class UsersService implements IUsersService {
    constructor(
        @InjectRepository(User) private repository: Repository<User>,
        private httpService: HttpService //REMOVE after e2e tests are fixed
    ) {}
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
            //FRAGE: geht auch repository.hasId(id) ?
            const idExists =
                0 < (await this.repository.count({ where: { id: id } }));
            if (idExists) {
                // FRAGE: wie am besten als oneliner (it save)?
                await this.repository.update({ id: id }, updates);
                const updatedUser = await this.repository.findOne({
                    where: { id: id },
                });
                return updatedUser;
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
                e.name.match(/UNIQUE constraint failed/i)
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
        console.log('I work');
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
    //REMOVE after tests are fixed
    postRandomUser = async () => {
        const user = this.randomUser();
        try {
            const result = await firstValueFrom(
                this.httpService
                    .post('http://localhost:3000/users/', user)
                    .pipe(map((res) => res.data))
            );
        } catch (e) {
            console.log(e);
        }
    };
    deleteRandomUser = async (id: string) => {
        try {
            await firstValueFrom(
                this.httpService.delete('http://localhost:3000/users/' + id)
            );
        } catch (error) {
            console.log(error);
        }
    };
    updateRandomUser = async (id: string) => {
        try {
            const update: Partial<CreateUserDto> = { name: 'Rick Sanchez' };
            await firstValueFrom(
                this.httpService.patch(
                    'http://localhost:3000/users/' + id,
                    update
                )
            );
        } catch (e) {
            console.log(e);
        }
    };
    private randomUser = (): CreateUserDto => {
        const name = 'HenryThe' + 'King';
        const email = name.toLowerCase().replace('.', '') + '@gmail.com';
        const password = 'ForTheKingYouLousyPeasants';
        return { name, email, password };
    };
}
