import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

// Nest modules
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

// Global modules
import { PrismaModule } from './prisma/prisma.module';

// App modules
import { UsersModule } from './users/users.module';

// Filters
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  levelFirst: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
      },
    }),
    PrismaModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
