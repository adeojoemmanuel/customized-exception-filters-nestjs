import { ArgumentsHost } from '@nestjs/common';
import { AxiosError } from 'axios';
import { AxiosExceptionFilter } from './axios.exception.filter.ts';

describe('AxiosExceptionFilter', () => {
  let filter: AxiosExceptionFilter;
  let host: ArgumentsHost;
  let response: any;

  beforeEach(() => {
    filter = new AxiosExceptionFilter();
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => response,
      }),
    } as any;
  });

  it('should catch and handle AxiosError', () => {
    const error = {
      response: {
        status: 404,
        data: { message: 'Not found' },
      },
    } as AxiosError;

    filter.catch(error, host);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ message: {message:'Not found'} });
  });

  it('should handle undefined error response', () => {
    const error = {} as AxiosError;

    filter.catch(error, host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
