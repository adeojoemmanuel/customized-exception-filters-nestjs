import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data || error.response.statusText : 'Internal server error';
    response.status(status).json({ message });
  }
}