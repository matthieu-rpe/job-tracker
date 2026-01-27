// src/setup-app.ts
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import helmet from 'helmet';

export function configureApp(app: INestApplication) {
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const expressApp = app as NestExpressApplication;

  // 0. Trust proxy (if IP is behind Load Balancer)
  const trustProxy = configService.get<string | boolean>('TRUST_PROXY', false);
  if (trustProxy) {
    expressApp.set('trust proxy', trustProxy === 'true' ? true : trustProxy);
  }

  // 1. Security using helmet
  app.use(helmet());

  // 2. CORS
  const originsConfig = configService.get<string>('ALLOWED_ORIGINS');
  const allowedOrigins = originsConfig ? originsConfig.split(',') : [];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (
        configService.get('NODE_ENV') === 'development' &&
        origin.startsWith('http://localhost:')
      ) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  } as CorsOptions);

  // 3. API route prefix
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 4. Validation & Transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 5. Serialization (exclude all field but not @Expose)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      strategy: 'excludeAll',
    }),
  );

  return app;
}
