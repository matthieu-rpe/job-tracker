import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'john@doe.com' })
  email: string;

  @IsStrongPassword()
  @ApiProperty({
    example: 'P@ssword123!',
    description: 'Min 8 chars, 1 upper, 1 lower, 1 number, 1 symbol.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'doe' })
  lastname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'john' })
  firstname?: string;
}
