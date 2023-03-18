/* eslint-disable import/prefer-default-export */
import { Response as ExpressResponse } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { ExceptionResponse } from '../interface/exception-response.interface';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res = ctx.getResponse<ExpressResponse>();

    const exceptionResponse: ExceptionResponse = exception.getResponse() as ExceptionResponse;

    const errorBody = {
      error: exception.name,
    };

    if (Array.isArray(exceptionResponse.message)) {
      Reflect.set(errorBody, 'messages', exceptionResponse.message);
    } else {
      Reflect.set(errorBody, 'message', exceptionResponse.message);
    }

    return res.status(HttpStatus.UNAUTHORIZED).json(errorBody);
  }
}
