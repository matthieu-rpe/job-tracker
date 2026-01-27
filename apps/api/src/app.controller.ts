import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class HealthResponseDto {
  @Expose()
  status: string;

  constructor(dto: HealthResponseDto) {
    Object.assign(this, dto);
  }
}

@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Returns status ok for health check.' })
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
}
