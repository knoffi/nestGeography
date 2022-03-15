import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
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
        expect(responseBody).toHaveLength(4);
    });
    it('get user by id', () => {
        const responseBody = controller.getUser('69');
        expect(responseBody).toEqual(UsersServiceMock.mocks.user);
    });
});
