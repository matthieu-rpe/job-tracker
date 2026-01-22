import { Body, Controller, Post } from '@nestjs/common';

// Services
import { UsersService } from './users.service';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);

    return new UserResponseDto(user);
  }
}
