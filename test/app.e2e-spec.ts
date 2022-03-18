import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmAuthDto } from 'src/auth/Auth';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from './../src/users/users.entity';
import { UsersService } from './../src/users/users.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let service: UsersService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        service = app.get<UsersService>('IUsersService');
    });
    beforeEach(async () => {
        await service.clear();
        await service.fillRepo();
    });
    afterAll(async () => {
        await app.close();
    });

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
        const validID = await service.getValidID();
        const response = await request(app.getHttpServer())
            .get('/users/' + validID)
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
            .get('/users/applePie')
            .expect(HttpStatus.NOT_FOUND);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('message');
        const message = response.body['message'];
        expect(typeof message).toEqual('string');
        expect(message).toMatch(/not found/i);
    });
    it('USERS POST by valid data', async () => {
        const requestBody: CreateUserDto = {
            name: 'Dorian',
            password: '123456789',
            email: 'doriann@tester.com',
        };
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody)
            .expect(HttpStatus.CREATED);
        expectApplicationJSON(response);

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
            name: 12, // NOTE: this is not a string and even as a string it would be too short
            password: '123456789',
            email: 'user@gmail.com',
        };
        const response = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody);
        expectApplicationJSON(response);
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
    it('USERS POST by invalid password', async () => {
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
    it('USERS POST by invalid email', async () => {
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
    it('USERS DELETE after adding', async () => {
        const requestBody = {
            name: 'Turk',
            password: '123456789',
            email: 'turk@gmail.com',
        };
        const postResponse = await request(app.getHttpServer())
            .post('/users/')
            .send(requestBody)
            .expect(HttpStatus.CREATED);

        expect(postResponse.body.id).toBeTruthy();
        const idForDelete = postResponse.body.id;
        const deletion = await request(app.getHttpServer())
            .delete('/users/' + idForDelete)
            .expect(HttpStatus.NO_CONTENT);

        expect(deletion.body).toEqual({});

        const searchAfterDelete = await request(app.getHttpServer())
            .get('/users/' + idForDelete)
            .expect(HttpStatus.NOT_FOUND);
    });
    it('USERS DELETE by invalid id', async () => {
        const idForDelete = 'suchANonsense';
        const deletion = await request(app.getHttpServer())
            .delete('/users/' + idForDelete)
            .expect(HttpStatus.NOT_FOUND);

        expect(JSON.parse(deletion.text).message).toMatch(/not found/i);
    });
    it('USERS PATCH by valid data', async () => {
        const addFirstBody: CreateUserDto = {
            name: 'Elliot',
            email: 'elliot@gmail.com',
            password: 'IamBlondie',
        };
        const addFirst = await request(app.getHttpServer())
            .post('/users/')
            .send(addFirstBody)
            .expect(HttpStatus.CREATED);
        const idAfterAdd = addFirst.body.id;

        const newName = 'Elliot Jr.';
        const patchBody = { name: newName };
        const patch = await request(app.getHttpServer())
            .patch('/users/' + idAfterAdd)
            .send(patchBody)
            .expect(HttpStatus.OK);
        expect(patch.body.name).toEqual(newName);
        expect(patch.body.password).toBeUndefined();

        const selection = await request(app.getHttpServer())
            .get('/users/' + idAfterAdd)
            .expect(HttpStatus.OK);
        expect(selection.body.name).toEqual(newName);
    });
    it('USERS PATCH by empty data', async () => {
        const addFirstBody: CreateUserDto = {
            name: 'PatcherInvalid1',
            email: 'patcherinvalid1@gmail.com',
            password: 'IamBlondie',
        };
        const addFirst = await request(app.getHttpServer())
            .post('/users/')
            .send(addFirstBody)
            .expect(HttpStatus.CREATED);
        const idAfterAdd = addFirst.body.id;

        const patchBody = {};
        const patch = await request(app.getHttpServer())
            .patch('/users/' + idAfterAdd)
            .send(patchBody)
            .expect(HttpStatus.BAD_REQUEST);
    });
    it('USERS PATCH by invalid name', async () => {
        const addFirstBody: CreateUserDto = {
            name: 'Patcher3',
            email: 'patcher3@gmail.com',
            password: 'IamBlondie',
        };
        const addFirst = await request(app.getHttpServer())
            .post('/users/')
            .send(addFirstBody)
            .expect(HttpStatus.CREATED);
        const idAfterAdd = addFirst.body.id;

        const patchBody = { name: 'pa' };
        const patch = await request(app.getHttpServer())
            .patch('/users/' + idAfterAdd)
            .send(patchBody)
            .expect(HttpStatus.BAD_REQUEST);
    });
    it('USERS PATCH by invalid email', async () => {
        const addFirstBody: CreateUserDto = {
            name: 'Patcher4',
            email: 'patcher4@gmail.com',
            password: 'IamBlondie',
        };
        const addFirst = await request(app.getHttpServer())
            .post('/users/')
            .send(addFirstBody)
            .expect(HttpStatus.CREATED);
        const idAfterAdd = addFirst.body.id;

        const patchBody = { email: 'notAMail' };
        const patch = await request(app.getHttpServer())
            .patch('/users/' + idAfterAdd)
            .send(patchBody)
            .expect(HttpStatus.BAD_REQUEST);
    });
    it('USERS PATCH by invalid password', async () => {
        const addFirstBody: CreateUserDto = {
            name: 'Patcher5',
            email: 'patcher5@gmail.com',
            password: 'IamBlondie',
        };
        const addFirst = await request(app.getHttpServer())
            .post('/users/')
            .send(addFirstBody)
            .expect(HttpStatus.CREATED);
        const idAfterAdd = addFirst.body.id;

        const patchBody = { password: '123' };
        const patch = await request(app.getHttpServer())
            .patch('/users/' + idAfterAdd)
            .send(patchBody)
            .expect(HttpStatus.BAD_REQUEST);
    });
    it('USERS PATCH by email which is already used', async () => {
        const addFirstBody: CreateUserDto = {
            name: 'Patcher6',
            email: 'patcher6@gmail.com',
            password: 'IamBlondie',
        };
        const addSecondBody: CreateUserDto = {
            name: 'Patcher7',
            email: 'patcher7@gmail.com',
            password: 'IamBlondie',
        };
        const addFirst = await request(app.getHttpServer())
            .post('/users/')
            .send(addFirstBody)
            .expect(HttpStatus.CREATED);
        const idAfterAdd = addFirst.body.id;
        const addSecond = await request(app.getHttpServer())
            .post('/users/')
            .send(addSecondBody)
            .expect(HttpStatus.CREATED);

        const patchBody = { email: addSecondBody.email };
        const patch = await request(app.getHttpServer())
            .patch('/users/' + idAfterAdd)
            .send(patchBody)
            .expect(HttpStatus.CONFLICT);
    });
    it('AUTH by valid login', async () => {
        const newUserForLogin: CreateUserDto = {
            name: 'Billy Jean',
            email: 'michael@gmail.com',
            password: 'Is not my lover',
        };
        const postNewUser = await request(app.getHttpServer())
            .post('/users/')
            .send(newUserForLogin)
            .expect(HttpStatus.CREATED);

        const loginNewUser: ConfirmAuthDto = { ...newUserForLogin };
        const postLogin = await request(app.getHttpServer())
            .post('/auth/login/')
            .send(loginNewUser)
            .expect(HttpStatus.OK);
        expect(postLogin.body.token).toBeTruthy();
        expect(typeof postLogin.body.token === 'string').toBeTruthy();
    });
    it('AUTH by wrong password or unfound name', async () => {
        const newUserForLogin: CreateUserDto = {
            name: 'Lucy',
            email: 'beatles@gmail.com',
            password: 'In the sky with diamonds',
        };
        const postNewUser = await request(app.getHttpServer())
            .post('/users/')
            .send(newUserForLogin)
            .expect(HttpStatus.CREATED);

        // WRONG Password
        const loginNewUser1: ConfirmAuthDto = {
            ...newUserForLogin,
            password: 'not the password',
        };
        const postLogin1 = await request(app.getHttpServer())
            .post('/auth/login/')
            .send(loginNewUser1)
            .expect(HttpStatus.UNAUTHORIZED);
        expect(postLogin1.body).toEqual({});

        // UNFOUND Name
        const suffixForUnfoundMail = Math.round(
            Math.random() * 10000
        ).toString();
        const loginNewUser2: ConfirmAuthDto = {
            email: 'a' + suffixForUnfoundMail + '@notfound.com',
            password: newUserForLogin.password,
        };
        const postLogin2 = await request(app.getHttpServer())
            .post('/auth/login/')
            .send(loginNewUser2)
            .expect(HttpStatus.UNAUTHORIZED);
        expect(postLogin2.body).toEqual({});
    });
    it('AUTH by invalid email', async () => {
        const loginNewUser: ConfirmAuthDto = {
            email: 'a',
            password: 'not the password',
        };
        const postLogin = await request(app.getHttpServer())
            .post('/auth/login/')
            .send(loginNewUser)
            .expect(HttpStatus.BAD_REQUEST);
        expect(postLogin.body.message).toBeTruthy();
        expect(postLogin.body.message).toBeInstanceOf(Array);
        expect(postLogin.body.message).toHaveLength(1);
        expect(postLogin.body.message[0]).toMatch(/email/);
    });
    it('AUTH by invalid password length', async () => {
        const loginNewUser: ConfirmAuthDto = {
            email: 'absen@gmail.com',
            password: 'a',
        };
        const postLogin = await request(app.getHttpServer())
            .post('/auth/login/')
            .send(loginNewUser)
            .expect(HttpStatus.BAD_REQUEST);
        expect(postLogin.body.message).toBeTruthy();
        expect(postLogin.body.message).toBeInstanceOf(Array);
        expect(postLogin.body.message).toHaveLength(1);
        expect(postLogin.body.message[0]).toMatch(/password/);
    });
});

const expectApplicationJSON = (response: request.Response) =>
    expect(response.header['content-type']).toMatch(/application\/json.*/);
