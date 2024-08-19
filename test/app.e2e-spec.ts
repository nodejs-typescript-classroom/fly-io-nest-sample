import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    )
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('hi hi');
  });
  it('/life (POST) with invalidate input', () => {
    return request(app.getHttpServer())
      .post('/life')
      .send({
        name: 'Pick',
        dateOfBirth: '1988-08-01',
        expectSurviveAge: -20
      }).expect(400)
  })
  it('/life (POST) with invalidate input', () => {
    return request(app.getHttpServer())
      .post('/life')
      .send({
        name: 'Pick',
        dateOfBirth: '1988-08-01++',
        expectSurviveAge: 30
      }).expect(400)
  })
  it('/life (POST) with valid input', () => {
    return request(app.getHttpServer())
      .post('/life')
      .send({
        name: 'Eddie',
        dateOfBirth: '1988-08-01',
        expectSurviveAge: 75
      }).expect(201)
  })
});
