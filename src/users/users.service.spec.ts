import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';

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
                    logging: true,
                    synchronize: true,
                }),
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        service.fillRepo();
    });
    afterEach(async () => {
        await service.clear();
        await service.fillRepo();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('all users', async () => {
        const users = await service.allUsers();
        expect(users.length).toBeGreaterThan(0);
    });
    it('user by valid id', async () => {
        const validID = await service.getValidID();
        const user = await service.getUser(validID);
        expect(user instanceof User).toBeTruthy();
    });
    it('create valid user', () => {
        const request = {
            name: 'Max',
            email: 'maxmustermann@unitTest.com',
            password: '123456789',
        };
        const creation = service.create(request);
        expect(creation instanceof User).toBeTruthy();
        if (creation instanceof User) {
            Object.keys(request).forEach((prop) =>
                expect(request[prop]).toEqual(creation[prop])
            );

            const selection = service.getUser(creation.id);
            expect(selection instanceof User).toBeTruthy();
            Object.keys(request).forEach((prop) =>
                expect(request[prop]).toEqual(selection[prop])
            );
        }
    });
    it('create same user twice', () => {
        // TODO: needs to work independent of previous test, THUS clear/reset users
        const request = {
            name: 'Dobby',
            email: 'dobby@unitTest.com',
            password: '123456789',
        };
        const creation = service.create(request);
        const secondCreation = service.create(request);
        expect(creation instanceof User).toBeTruthy();
        expect(secondCreation instanceof HttpException).toBeTruthy();
        if (secondCreation instanceof HttpException) {
            expect(secondCreation.getStatus()).toEqual(HttpStatus.CONFLICT);
            expect(secondCreation.message).toMatch(/email/i);
        }
    });
});
