import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

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
  getHealth() {
    return { status: 'ok' };
  }
}
