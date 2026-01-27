import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

class HealthResponseDto {
  @Expose()
  status: string;

  constructor(dto: HealthResponseDto) {
    Object.assign(this, dto);
  }
}

class ValidationTestDto {
  @IsString()
  @ApiProperty({ example: 'ok' })
  status: string;
}

@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Returns status ok for GET health check.' })
  @ApiOkResponse({
    description: 'Health check passed',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          default: 'ok',
        },
      },
    },
  })
  getHealth(): HealthResponseDto {
    return new HealthResponseDto({ status: 'ok' });
  }

  @Post()
  @ApiOperation({ summary: 'Returns status ok for POST health check.' })
  @ApiOkResponse({
    description: 'Health check passed',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
      },
    },
  })
  postHealth(@Body() body: ValidationTestDto) {
    return new HealthResponseDto({ status: body.status });
  }
}
