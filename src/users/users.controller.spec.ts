import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersServiceMock } from './users.service.mock';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            // is for injectable providing (for controller) during tests
            providers: [
                { useClass: UsersServiceMock, provide: 'IUsersService' },
            ],
        }).compile();

        controller = moduleRef.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('get users', () => {
        const responseBody = controller.allUsers();
        expect(responseBody).toEqual(UsersServiceMock.stubs.allUsers);
    });
    it('get user by id', () => {
        const responseBody = controller.getUser('69');
        expect(responseBody).toEqual(UsersServiceMock.stubs.user);
    });
    it('post valid user', () => {
        const creationData: Omit<User, 'id'> = {
            email: 'test@gmail.com',
            name: 'peter',
            password: '191919191',
        };
        const responseBody = controller.createUser(creationData);
        expect(responseBody instanceof User).toBeTruthy();
        Object.keys(creationData).forEach((prop) => {
            expect(responseBody[prop]).toEqual(creationData[prop]);
        });
        // NOTE: Service mock has only stub methods, thus new user creation will not be added to .stub.allUsers
    });
});
