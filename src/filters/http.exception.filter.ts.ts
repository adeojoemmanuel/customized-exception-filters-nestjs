import { Response as ExpressResponse } from 'express';
import {
 ArgumentsHost, Catch, ExceptionFilter, HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { HttpExceptionResponse } from '../interface/exception-response.interface';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res = ctx.getResponse<ExpressResponse>();
    const status = exception.getStatus() || 500;
    const exceptionResponse: HttpExceptionResponse = exception.getResponse() as HttpExceptionResponse;
    const errorBody = { statusCode: status };

    if (Array.isArray(exceptionResponse.message)) {
      Reflect.set(errorBody, 'messages', exceptionResponse.message);
    } else {
      Reflect.set(errorBody, 'message', exceptionResponse.message);
    }

    return res.status(status).json(errorBody);
  }
}
