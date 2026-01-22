import { UserModel } from 'src/generated/prisma/models';

export interface UserLogData {
  id: number;
  email: string;
  lastname: string | null;
  firstname: string | null;
}

export class UsersMapper {
  static toLog(user: UserModel): UserLogData {
    return {
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
    };
  }
}
