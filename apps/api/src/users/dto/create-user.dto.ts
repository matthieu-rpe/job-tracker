import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  firstname?: string;
}
