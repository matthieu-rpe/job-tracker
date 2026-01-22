import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  /*
   * FIRST : MIDDLEWARE
   */

  /*
   * SECOND : GUARDS
   */

  /*
   * THIRD + FIVE (res) : INTERCEPTORS
   *
   * Inspirated by the Aspect Oriented Programming (AOP) technique.
   * - bind extra logic before / after method execution
   * - transform the result returned from a function
   * - transform the exception thrown from a function
   * - extend the basic function behavior
   * - completely override a function depending on specific conditions (e.g. for caching purpose)
   */

  // Serializer for every class (new keyword that creates a prototype different from Object.prototype) that exclude all fields excepts one with @Expose
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  /*
   * FOUR : PIPES
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

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
