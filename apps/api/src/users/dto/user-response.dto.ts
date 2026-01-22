import { Expose } from 'class-transformer';
import { UserModel } from 'src/generated/prisma/models';

// On prend le CreateUserDto, mais on retire le password
// et on pourrait ajouter l'ID par exemple
export class UserResponseDto implements Partial<UserModel> {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  lastname: string | null;

  @Expose()
  firstname: string | null;

  @Expose()
  createdAt: Date;
}
