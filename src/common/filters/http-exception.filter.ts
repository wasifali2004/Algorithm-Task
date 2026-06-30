import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    // get the request and response
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    // get the status and message
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.getMessage(exception);

    // log unknown errors
    if (!(exception instanceof HttpException)) {
      const stack =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error('Unhandled request error', stack);
    }

    // return the error
    response.status(statusCode).json({
      statusCode,
      message,
      error: message,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }

  private getMessage(exception: unknown): string {
    // hide unknown errors
    if (!(exception instanceof HttpException)) {
      return 'Internal server error';
    }

    // read the Nest error
    const body = exception.getResponse();
    if (typeof body === 'string') {
      return body;
    }

    const value = body as { message?: string | string[]; error?: string };
    if (Array.isArray(value.message)) {
      return value.message.join('; ');
    }

    return value.message ?? value.error ?? exception.message;
  }
}
