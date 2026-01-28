import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersMapper } from './users.mapper';
import { UserModel } from 'src/generated/prisma/models';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

const mockUsersService = {
  create: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create, use the mapper and return the toResponse user', async () => {
      // ARRANGE

      const createUserDto: CreateUserDto = {
        email: 'john@doe.com',
        password: 'Password123!',
      };

      // stub user from service
      const userModelStub: UserModel = {
        id: 1,
        email: createUserDto.email,
        password: 'fake_hashed_password',
        lastname: null,
        firstname: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      };

      // stub UserResponseDto from mapper
      const UserResponseDtoStub: UserResponseDto = {
        id: 1,
        email: userModelStub.email,
        lastname: null,
        firstname: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
      };

      mockUsersService.create.mockResolvedValue(userModelStub);
      const mapperSpy = jest
        .spyOn(UsersMapper, 'toResponse')
        .mockReturnValue(UserResponseDtoStub);

      // CALL
      const result = await controller.create(createUserDto);

      // ASSERT
      // We called the service with expected createUserDto
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);

      // Expect the returned UserModel to be mapped
      expect(mapperSpy).toHaveBeenCalledTimes(1);
      expect(mapperSpy).toHaveBeenCalledWith(userModelStub);

      // Expect the mapped ToResponse to be returned as UserResponseDto (Contract of API)
      expect(result).toBe(UserResponseDtoStub);
    });
  });
});
