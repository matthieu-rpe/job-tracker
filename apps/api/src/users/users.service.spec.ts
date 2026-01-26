import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';

import { UsersService } from './users.service';
import { UserCreateInput, UserModel } from 'src/generated/prisma/models';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if email exists', async () => {
      const newUserEmail = 'john@doe.com';
      const existingUser: UserModel = {
        id: 1,
        email: newUserEmail,
        password: 'hashed_password',
        lastname: null,
        firstname: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      await expect(
        service.create({ email: newUserEmail, password: 'Password123!' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash the password and save it to the database', async () => {
      const rawPassword = 'Password123!';

      // Config mock
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockImplementation(
        (args: { data: UserCreateInput }): UserModel => ({
          id: 1,
          email: args.data.email,
          password: args.data.password,
          lastname: null,
          firstname: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      const spyHash = jest.spyOn(bcrypt, 'hash') as jest.SpyInstance;

      const result = await service.create({
        email: 'john@doe.com',
        password: rawPassword,
      });

      expect(spyHash).toHaveBeenCalledWith(rawPassword, 10);
      expect(result.password).not.toBe(rawPassword);
      expect(result.password).toMatch(/^\$2[ayb]\$.{56}$/);
    });
  });
});
