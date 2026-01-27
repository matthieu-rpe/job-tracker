import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { configureApp } from 'src/configure-app';

describe('Users Module e2e', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configureApp(app);

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/api/v1/users (POST)', () => {
    it('Should create user with MINIMAL fields, return 201', async () => {
      const payload = {
        email: 'minimal@foo.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(payload)
        .expect(201);

      const body = response.body as UserResponseDto;

      expect(body).toHaveProperty('id');
      expect(body.email).toBe(payload.email);
      expect(body).not.toHaveProperty('password');
      expect(body.lastname).toBe(null);
      expect(body.firstname).toBe(null);
      expect(new Date(body.createdAt).getTime()).not.toBeNaN();
      expect(body).not.toHaveProperty('updatedAt');
    });

    it('Should create user with ALL fields, return 201', async () => {
      const payload = {
        email: 'full@foo.com',
        password: 'Password123!',
        lastname: 'Foo',
        firstname: 'Full',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(payload)
        .expect(201);

      const body = response.body as UserResponseDto;

      expect(body.lastname).toBe(payload.lastname);
      expect(body.firstname).toBe(payload.firstname);
    });

    it('Should fail with 400 if email is invalid', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'not-an-email',
          password: 'Password123!',
        })
        .expect(400);
    });

    it("Should fail with 400 if password doesn't have uppercase", async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'no-uppercase@foo.com',
          password: 'password123!',
        })
        .expect(400);
    });

    it("Should fail with 400 if password doesn't have lowercase", async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'no-lowercase@foo.com',
          password: 'PASSWORD123!',
        })
        .expect(400);
    });

    it("Should fail with 400 if password doesn't have number", async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'no-number@foo.com',
          password: 'PasswordTest!',
        })
        .expect(400);
    });

    it("Should fail with 400 if password doesn't have special character", async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'no-special@foo.com',
          password: 'Password1234',
        })
        .expect(400);
    });

    it('Should fail with 400 if password has a length below 8', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'below8@foo.com',
          password: 'Pa1!',
        })
        .expect(400);
    });

    it('Should fail with 400 if email is missing', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ password: 'Password123!' })
        .expect(400);
    });

    it('Should fail with 400 if password is missing', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ email: 'no-password@foo.com' })
        .expect(400);
    });

    it('Should fail with 400 if extra field is provided', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'extra-field@foo.com',
          password: 'Password123!',
          foo: 'bar',
        })
        .expect(400);
    });

    it('Should fail with 409 if email already exists', async () => {
      const payload = {
        email: 'conflict@foo.com',
        password: 'Password123!',
      };

      // first call to create user
      await request(app.getHttpServer()).post('/api/v1/users').send(payload);

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(payload)
        .expect(409);
    });
  });
});
