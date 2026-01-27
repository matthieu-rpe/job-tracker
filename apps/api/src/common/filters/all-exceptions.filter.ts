// src/common/filters/all-exceptions.filter.ts
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request } from 'express';

// Injected dependencies
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

interface NestExceptionResponse {
  message?: string | string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const path = httpAdapter.getRequestUrl(request) as string;
    const requestId = request['id'] || 'no-id';

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error({
      requestId,
      msg: 'Unhandled Exception',
      method: request.method,
      path,
      error: exception instanceof Error ? exception.message : exception,
      stack: exception instanceof Error ? exception.stack : null,
    });

    const responseBody = {
      requestId,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path,
      message:
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? (exceptionResponse as NestExceptionResponse).message ||
            exceptionResponse
          : exceptionResponse,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
