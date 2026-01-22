import { Injectable, Logger } from '@nestjs/common';

// packages
import bcrypt from 'bcrypt';

// Services
import { PrismaService } from 'src/prisma/prisma.service';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';

// DB Models
import { UserModel } from 'src/generated/prisma/models';
import { UsersMapper } from './users.mapper';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    this.logger.log(
      {
        method: 'create',
        user: UsersMapper.toLog(user),
      },
      'User created successfully',
    );
    return user;
  }
}
