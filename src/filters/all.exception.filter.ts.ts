import { Catch, ExceptionFilter, ArgumentsHost} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 500;

    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
    });
  }
}