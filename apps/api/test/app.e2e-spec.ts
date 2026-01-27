import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from 'src/app.module';

import { configureApp } from 'src/configure-app';

describe('App e2e', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configureApp(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 OK and valid body', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });

    it('Should have security (Helmet)', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/health');

      expect(response.headers['x-dns-prefetch-control']).toBe('off');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-download-options']).toBe('noopen');
      expect(response.headers['x-xss-protection']).toBe('0');
      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['cross-origin-opener-policy']).toBe(
        'same-origin',
      );
      expect(response.headers['cross-origin-resource-policy']).toBe(
        'same-origin',
      );
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('Should handle CORS whitelisting', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000',
      );
      expect(response.headers['vary']).toContain('Origin');
    });

    it('Should REJECT non-whitelisted CORS origins', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .set('Origin', 'http://malicious-site.com');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('Should handle CORS preflight requests (OPTIONS)', async () => {
      const response = await request(app.getHttpServer())
        .options('/api/v1/health') // We use .options() here
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000',
      );
      expect(response.headers['access-control-allow-methods']).toContain(
        'POST',
      );
    });

    it('should block requests with non-whitelisted properties', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/health')
        .send({
          status: 'ok',
          hackerField: 'I try to inject this',
        });

      expect(response.status).toBe(400);

      const body = response.body as { message: string[] };
      expect(body.message[0]).toMatch(/property hackerField should not exist/);
    });

    it('should return 429 Too Many Requests after exceeding limit', async () => {
      for (let i = 0; i < 100; i++) {
        await request(app.getHttpServer()).get('/api/v1/health');
      }

      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(429);

      const body = response.body as { message: string };

      expect(body.message).toMatch(/ThrottlerException: Too Many Requests/); // Too Many Requests
    });

    it('Should return 404 for non-existent routes with correct prefix', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/non-existent')
        .expect(404);
    });
  });
});
