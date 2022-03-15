import { INestApplication } from '@nestjs/common';
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
    it('/users/ (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/')
            .expect(200);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('length');
        const userAmount: number = response.body.length;
        expect(typeof userAmount).toEqual('number');
        expect(userAmount).toBeGreaterThanOrEqual(4);
    });
    it('/users/69 (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/69')
            .expect(200);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('name');
        const userName: string = response.body.name;
        expect(typeof userName).toEqual('string');
        expect(userName).toEqual('Barney Stinson');
    });
    it('/users/1 (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/1')
            .expect(404);
        expectApplicationJSON(response);

        expect(response.body).toHaveProperty('message');
        const message = response.body['message'];
        expect(typeof message).toEqual('string');
        expect(message).toMatch(/not found/i);
    });
});

const expectApplicationJSON = (response: request.Response) =>
    expect(response.header['content-type']).toMatch(/application\/json.*/);
