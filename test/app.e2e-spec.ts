import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/users/User';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    // it('/pokemon/25 (GET)', () => {
    //     return request(app.getHttpServer())
    //         .get('/pokemon/25')
    //         .expect(HttpStatus.OK);
    // });
    // it('/geography/HK (GET)', () => {
    //     return request(app.getHttpServer())
    //         .get('/geography/HK')
    //         .expect(HttpStatus.OK);
    // });
    it('USERS GET all', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/')
            .expect(HttpStatus.OK);
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
            .expect(HttpStatus.OK);
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
            .expect(HttpStatus.NOT_FOUND);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('message');
        const message = response.body['message'];
        expect(typeof message).toEqual('string');
        expect(message).toMatch(/not found/i);
    });
    it('USERS POST by valid data', async () => {
        const requestBody: CreateUserDto = {
            name: 'Max',
            password: '123456789',
            email: 'maxmustermann@tester.com',
        };
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody);
        expectApplicationJSON(response);
        expect(response.status).toEqual(HttpStatus.CREATED);

        expect(response.body).toBeDefined();

        const body = response.body;
        expect(body.password).toBeUndefined();
        expect(body).toHaveProperty('id');
        expect(body.name).toEqual(requestBody.name);
        expect(body.email).toEqual(requestBody.email);

        const selection = await request(app.getHttpServer())
            .get('/users/' + body.id)
            .expect(HttpStatus.OK);
        const selectionResult = selection.body;
        expect(selectionResult.name).toEqual(requestBody.name);
        expect(selectionResult.email).toEqual(requestBody.email);
    });
    it('USERS POST by invalid name', async () => {
        const requestBody = {
            name: 123, // NOTE: this is not a string
            password: '123456789',
            email: 'user@gmail.com',
        };
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody);
        expectApplicationJSON(response);
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
    it('USERS POST by password', async () => {
        const requestBody = {
            name: 'Boldwin',
            password: '1', // NOTE: this is too short
            email: 'user@gmail.com',
        };
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody);
        expectApplicationJSON(response);
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
    it('USERS POST by password', async () => {
        const requestBody = {
            name: 'Boldwin',
            password: '123456789',
            email: 'this is not a mail', // NOTE: this is not an email
        };
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody);
        expectApplicationJSON(response);
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
    it('USERS POST conflict after posting email twice', async () => {
        const requestBody = {
            name: 'Boldwin',
            password: '123456789',
            email: 'user@gmail.com',
        };
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody)
            .expect(HttpStatus.CREATED);
        const secondResponse = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody)
            .expect(HttpStatus.CONFLICT);
    });
});

const expectApplicationJSON = (response: request.Response) =>
    expect(response.header['content-type']).toMatch(/application\/json.*/);
