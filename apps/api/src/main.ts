import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as packageJson from '../package.json';

// Dependencies
import helmet from 'helmet';

// App module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // 1. LOGGER : Catch everything that follows using Pino
  app.useLogger(app.get(Logger));

  // 2 ENV : Get environment variables
  const configService = app.get(ConfigService);

  // 3. SERVER CONFIGURATION : Before middleware security to read the IP
  const trustProxy = configService.get<string | boolean>('TRUST_PROXY', false);
  if (trustProxy) {
    app.set('trust proxy', trustProxy === 'true' ? true : trustProxy);
  }

  // 4.1 LOW LEVEL SECURITY : Helmet for headers
  app.use(helmet());

  // 4.2 LOW LEVEL SECURITY : CORS
  const originsConfig = configService.get<string>('ALLOWED_ORIGINS');
  const allowedOrigins = originsConfig ? originsConfig.split(',') : [];

  app.enableCors({
    origin: (origin, callback) => {
      // Authorize request without origins (mobile, postman, etc).
      if (!origin) {
        return callback(null, true);
      }

      // Origin is whitelisted
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      }

      // In development, localhost authorized
      if (
        configService.get('NODE_ENV') === 'development' &&
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true);
      }

      // Reject
      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // 5. VERSIONING AND PREFIX
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 6. PIPES AND FILTERS
  // 6.1 MIDDLEWARE
  // 6.2 GUARDS

  /*
   * 6.3 INTERCEPTORS (on request)
   *
   * Inspirated by the Aspect Oriented Programming (AOP) technique.
   * - bind extra logic before / after method execution
   * - transform the result returned from a function
   * - transform the exception thrown from a function
   * - extend the basic function behavior
   * - completely override a function depending on specific conditions (e.g. for caching purpose)
   */

  /*
   * 6.4 PIPES
   *
   * Transformation : Transform input data to the desired form (e.g. from string to integer)
   * Validation : evaluate input data and if unvalid, throw an exception
   */

  // For each route with a DTO : transform and validate the DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /*
   * 6.5 INTERCEPTORS (on response)
   * see 6.3
   */

  // Serializer for every class (Reflector is interface to read metadata of prototype; Interceptor serialize raw data into response DTO)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  // 7. HOOKS
  app.enableShutdownHooks(); // process crash or shutdown : close db connection

  // 8. SWAGGER : API documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Job Tracker API')
      .setVersion(packageJson.version)
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  // 9. LAUNCH
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

void bootstrap();
