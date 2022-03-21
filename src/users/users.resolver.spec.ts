import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersServiceMock } from './users.service.mock';

describe('UsersResolver', () => {
    let resolver: UsersResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersResolver,
                { useClass: UsersServiceMock, provide: 'IUsersService' },
            ],
        }).compile();

        resolver = module.get<UsersResolver>(UsersResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
