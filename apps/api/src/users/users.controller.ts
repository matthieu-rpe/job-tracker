import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// Services
import { UsersService } from './users.service';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersMapper } from './users.mapper';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'The user has been successfully created.',
  })
  @ApiConflictResponse({ description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);

    return UsersMapper.toResponse(user);
  }
}
