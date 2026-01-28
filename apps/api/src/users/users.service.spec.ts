import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';

import { UsersService } from './users.service';
import { UserModel } from 'src/generated/prisma/models';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersMapper } from './users.mapper';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if email exists', async () => {
      // ARRANGE
      const createUserDto: CreateUserDto = {
        email: 'john@doe.com',
        password: '',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        password: '',
        lastname: null,
        firstname: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      } as UserModel);

      // CALL + ASSERT
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash the password before calling prisma.create', async () => {
      // ARRANGE
      const rawPassword = 'Password123!';
      const hashedPassword = 'fake_hashed_password';

      const createUserDto: CreateUserDto = {
        email: 'john@doe.com',
        password: rawPassword,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(UsersMapper, 'toLog').mockReturnValue({
        id: 1,
        email: createUserDto.email,
        lastname: null,
        firstname: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      });

      // CALL
      await service.create(createUserDto);

      // ASSERT
      // bcrypt has been used to hash password
      expect(bcrypt.hash).toHaveBeenCalledWith(rawPassword, 10);

      // prisma received the hashed password, not rawPassword
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            email: createUserDto.email,
            password: hashedPassword,
          },
        }),
      );
    });

    it('should return the exact user model created by prisma', async () => {
      // ARRANGE
      const createUserDto: CreateUserDto = {
        email: 'john@doe.com',
        password: 'fake_password',
      };

      const userModelStub: UserModel = {
        id: 1,
        email: createUserDto.email,
        password: 'fake_hash_password',
        lastname: null,
        firstname: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      };

      // Prisma returns a UserModel in the service
      mockPrisma.user.create.mockResolvedValue(userModelStub);

      // CALL
      const result = await service.create(createUserDto);

      // ASSERT
      // expect the service to return the UserModel from prisma
      expect(result).toEqual(userModelStub);
    });

    it('should log the user creation using the mapper (security check)', async () => {
      // ARRANGE
      const userModelStub: UserModel = {
        id: 1,
        email: 'test@test.com',
        password: 'hash',
        lastname: null,
        firstname: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      };

      const userToLogStub: ReturnType<typeof UsersMapper.toLog> = {
        id: 1,
        email: 'test@test.com',
        lastname: null,
        firstname: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      };

      mockPrisma.user.create.mockResolvedValue(userModelStub);
      const mapperSpy = jest
        .spyOn(UsersMapper, 'toLog')
        .mockReturnValue(userToLogStub);
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // CALL
      await service.create({
        email: userModelStub.email,
        password: 'Password123!',
      });

      // ASSERT
      // 1. Mapper.toLog has been called using the returned prisma user model
      expect(mapperSpy).toHaveBeenCalledWith(userModelStub);

      // 2. Logger has received the secured mapped user object
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'create',
          user: userToLogStub,
        }),
        'User created successfully',
      );
    });
  });
});
