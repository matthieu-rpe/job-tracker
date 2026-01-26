import { UserModel } from 'src/generated/prisma/models';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

export class UsersMapper {
  static toLog(user: UserModel): Omit<UserModel, 'password'> {
    return {
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponse(user: UserModel): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
