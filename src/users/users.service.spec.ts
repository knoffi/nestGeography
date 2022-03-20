import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersServiceErrors } from './users.service.errors';

describe('UsersService', () => {
    let service: UsersService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'db',
                    entities: [User],
                    logging: false,
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([User]),
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });
    afterEach(async () => {
        await service.clear();
        await service.fillRepo();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('all users after fill', async () => {
        const users = await service.allUsers();
        expect(users.length).toBeGreaterThan(0);
    });
    it('all users after clear', async () => {
        const clearRepo = await service.clear();
        const users = await service.allUsers();
        expect(users.length).toEqual(0);
    });
    it('user by valid id', async () => {
        const idWrapper = await service.getValidID();
        expect(idWrapper !== UsersServiceErrors.emptyDB);
        if (idWrapper !== UsersServiceErrors.emptyDB) {
            const user = await service.getUser(idWrapper.id);
            expect(user instanceof User).toBeTruthy();
        }
    });
    it('create valid user', async () => {
        const request = {
            name: 'Max',
            email: 'totalrandomshit2@unitTest.com',
            password: '123456789',
        };
        const creation = await service.create(request);
        expect(creation instanceof User).toBeTruthy();
        if (creation instanceof User) {
            Object.keys(request).forEach((prop) =>
                expect(request[prop]).toEqual(creation[prop])
            );

            const selection = await service.getUser(creation.id);
            expect(selection instanceof User).toBeTruthy();
            Object.keys(request).forEach((prop) =>
                expect(request[prop]).toEqual(selection[prop])
            );
        }
    });
    it('create same user twice', async () => {
        const request = {
            name: 'Dobby',
            email: 'dobby@unitTest.com',
            password: '123456789',
        };
        const creation = await service.create(request);
        const secondCreation = await service.create(request);
        expect(creation instanceof User).toBeTruthy();
        expect(secondCreation).toEqual(UsersServiceErrors.doubleEmail);
    });
});
