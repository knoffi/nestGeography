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
    it('/pokemon/RICK+MORTY (GET)', () => {
        return request(app.getHttpServer())
            .get('/pokemon/RICK+MORTY')
            .expect(HttpStatus.BAD_REQUEST);
    });
    it('/geography/HK (GET)', () => {
        return request(app.getHttpServer()).get('/geography/HK').expect(200);
    });
    it('/geography/RICK+MORTY (GET)', () => {
        return request(app.getHttpServer())
            .get('/geography/RICK+MORTY')
            .expect(HttpStatus.BAD_REQUEST);
    });
});
