import { ArgumentsHost } from '@nestjs/common';
import { AllExceptionsFilter } from './all.exception.filter.ts';

describe('AllExceptionFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  it('should catch an exception and return an internal server error response', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    };

    const error = new Error('Test error');

    filter.catch(error, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    // expect(mockResponse.json).toHaveBeenCalledWith({
    //   statusCode: 500,
    //   message: 'Internal server error',
    // });
  });
});
