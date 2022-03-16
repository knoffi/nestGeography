import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './User';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('all users', () => {
        const users = service.allUsers();
        expect(users).toHaveLength(4);
    });
    it('user by id', () => {
        const user = service.getUser('69');
        expect(user).toHaveProperty('name');
        expect(user.name).toEqual('Barney Stinson');
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
