import {  HttpStatus, NotFoundException } from '@nestjs/common';
import { NotFoundExceptionFilter } from './not-found-exception.filter';

describe('NotFoundExceptionFilter', () => {
  let filter: NotFoundExceptionFilter;
  let mockResponse: any;
  let mockHost: any;

  beforeEach(() => {
    filter = new NotFoundExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    };
  });

  it('should catch and handle NotFoundException with a valid response', () => {
    const exception = new NotFoundException('Resource not found');
    const expectedErrorBody = {
      error: 'NotFoundException',
      message: 'Resource not found',
    };

    filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp).toHaveBeenCalled();
    expect(mockHost.getResponse).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedErrorBody);
  });

  it('should catch and handle NotFoundException with multiple messages', () => {
    const exception = new NotFoundException(['Resource not found', 'Item not found']);
    const expectedErrorBody = {
      error: 'NotFoundException',
      messages: ['Resource not found', 'Item not found'],
    };

    filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp).toHaveBeenCalled();
    expect(mockHost.getResponse).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedErrorBody);
  });
});
