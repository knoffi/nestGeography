import { Test, TestingModule } from '@nestjs/testing';
import { users } from './User';
import { UsersController } from './users.controller';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('get users', () => {
        const responseBody = controller.allUsers();
        expect(responseBody).toHaveLength(users.length);
    });
});
