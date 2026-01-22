import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Global modules
import { PrismaModule } from './prisma/prisma.module';

// App modules
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
