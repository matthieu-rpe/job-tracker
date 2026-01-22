import { Exclude, Expose } from 'class-transformer';
import { UserModel } from 'src/generated/prisma/models';

// On prend le CreateUserDto, mais on retire le password
// et on pourrait ajouter l'ID par exemple
export class UserResponseDto {
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

  @Exclude()
  password: string;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }
}
