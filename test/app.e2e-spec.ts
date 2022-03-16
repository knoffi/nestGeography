import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/pokemon/25 (GET)', () => {
        return request(app.getHttpServer()).get('/pokemon/25').expect(200);
    });
    it('/geography/HK (GET)', () => {
        return request(app.getHttpServer()).get('/geography/HK').expect(200);
    });
    it('USERS GET all', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/')
            .expect(200);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('length');
        const userAmount: number = response.body.length;
        expect(typeof userAmount).toEqual('number');
        expect(userAmount).toBeGreaterThanOrEqual(4);

        const firstUser = response.body[0];
        expect(firstUser.password).toBeUndefined;
        Object.keys(firstUser).forEach((key) =>
            expect(key).not.toEqual('password')
        );
    });
    it('USERS GET by valid id', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/69')
            .expect(200);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('name');
        const user = response.body;
        const userName: string = user.name;
        expect(typeof userName).toEqual('string');
        expect(userName).toEqual('Barney Stinson');
        Object.keys(user).forEach((key) => expect(key).not.toEqual('password'));
    });
    it('USERS GET by invalid id', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/1')
            .expect(404);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('message');
        const message = response.body['message'];
        expect(typeof message).toEqual('string');
        expect(message).toMatch(/not found/i);
    });
    it('USERS POST by valid data', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send({
                name: 'Max',
                password: '123456789',
                email: 'maxmustermann@tester.com',
            });
        expectApplicationJSON(response);

        expect(response.status).toEqual(HttpStatus.CREATED);
    });
});

const expectApplicationJSON = (response: request.Response) =>
    expect(response.header['content-type']).toMatch(/application\/json.*/);
