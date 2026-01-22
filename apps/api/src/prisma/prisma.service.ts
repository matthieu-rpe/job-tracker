import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const url = configService.getOrThrow<string>('DATABASE_URL');
    const schema = configService.getOrThrow<string>('DATABASE_SCHEMA');

    const adapter = new PrismaPg({ connectionString: url }, { schema: schema });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
