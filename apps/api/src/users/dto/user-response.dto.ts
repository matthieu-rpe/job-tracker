import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserModel } from 'src/generated/prisma/models';

// On prend le CreateUserDto, mais on retire le password
// et on pourrait ajouter l'ID par exemple
export class UserResponseDto implements Partial<UserModel> {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'john@doe.com' })
  email: string;

  @Expose()
  @ApiProperty({ type: 'string', example: 'doe', nullable: true })
  lastname: string | null;

  @Expose()
  @ApiProperty({ type: 'string', example: 'doe', nullable: true })
  firstname: string | null;

  @Expose()
  @ApiProperty({ example: '2024-01-26T12:00:00.000Z' })
  createdAt: Date;
}
