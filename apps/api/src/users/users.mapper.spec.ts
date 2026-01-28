import { UserModel } from 'src/generated/prisma/models';

import { UsersMapper } from './users.mapper';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersMapper', () => {
  const userModelStub: UserModel = {
    id: 1,
    email: 'john@doe.com',
    password: 'fake_hashed_password',
    lastname: null,
    firstname: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  };

  describe('toLog', () => {
    it('should map all fields correctly for toLog', () => {
      // CALL
      const result = UsersMapper.toLog(userModelStub);

      // ASSERT
      // Expected variables to be logged
      expect(result).toEqual({
        id: userModelStub.id,
        email: userModelStub.email,
        lastname: userModelStub.lastname,
        firstname: userModelStub.firstname,
        createdAt: userModelStub.createdAt,
        updatedAt: userModelStub.updatedAt,
      });

      // Non expected variables to be removed
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('toResponse', () => {
    it('should match the UserResponseDto snapshot', () => {
      // CALL
      const result = UsersMapper.toResponse(userModelStub);

      // ASSERT
      // Expect result to be UserResponseDto
      expect(result).toBeInstanceOf(UserResponseDto);

      // Expected variables to be logged
      expect(result).toEqual({
        id: userModelStub.id,
        email: userModelStub.email,
        lastname: userModelStub.lastname,
        firstname: userModelStub.firstname,
        createdAt: userModelStub.createdAt,
      });

      // Non expected variables to be removed
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('updatedAt');
    });
  });
});
