import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserDto, User } from './users.entity';
import { UsersServiceMock } from './users.service.mock';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { useClass: UsersServiceMock, provide: 'IUsersService' },
            ],
        }).compile();

        controller = moduleRef.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('get users', async () => {
        const responseBody = await controller.allUsers();
        expect(responseBody).toEqual(UsersServiceMock.stubs.allUsers);
    });
    it('get user by id', async () => {
        const responseBody = await controller.getUser('69');
        expect(responseBody).toEqual(UsersServiceMock.stubs.user);
    });
    it('post valid user', async () => {
        const creationData: CreateUserDto = new User(
            'peter',
            'test@gmail.com',
            '191919191'
        );
        const responseBody = await controller.createUser(creationData);
        expect(responseBody instanceof User).toBeTruthy();
        Object.keys(creationData).forEach((prop) => {
            expect(responseBody[prop]).toEqual(creationData[prop]);
        });
        // NOTE: Service mock has only stub methods, thus new user creation will not be added to .stub.allUsers
    });
});
