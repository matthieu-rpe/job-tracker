import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersMapper } from './users.mapper';
import { UserModel } from 'src/generated/prisma/models';
import { CreateUserDto } from './dto/create-user.dto';

const mockUsersService = {
  create: jest.fn(),
};

describe('UserController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create, use the mapper and return a clean UserResponseDto', async () => {
      /*
       *  ARRANGE (with strict types)
       */
      const createUserDto: CreateUserDto = {
        email: 'johh@doe.com',
        password: 'Password123!',
      };

      const mockUserFromService: UserModel = {
        id: 1,
        email: 'john@doe.com',
        password: 'hashed_password',
        lastname: null,
        firstname: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockUserFromService);
      const mapperSpy = jest.spyOn(UsersMapper, 'toResponse');

      /*
       *  CALL
       */
      const result = await controller.create(createUserDto);
      const expectedResult = UsersMapper.toResponse(mockUserFromService);
      /*
       *  ASSERTS
       */

      // Expect call to UsersService
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);

      // Expect mapper to be called with the UsersService returned object
      expect(mapperSpy).toHaveBeenCalledWith(mockUserFromService);

      // Expect the result to respect the DTO (Contract of API)
      expect(result).toEqual(expectedResult);
      expect(result).not.toHaveProperty('password'); // smoke test
    });
  });
});
