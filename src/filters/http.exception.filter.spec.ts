import { ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response as ExpressResponse } from 'express';
import { HttpExceptionFilter } from './http.exception.filter.ts';
import { HttpExceptionResponse } from '../interface/exception-response.interface';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockHttpException: HttpException;
  let mockHost: ArgumentsHost;
  let mockResponse: ExpressResponse;
  let mockHttpArgHost: HttpArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockHttpException = new HttpException('Error message', 404);
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as ExpressResponse;
    mockHttpArgHost = {
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as HttpArgumentsHost;
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpArgHost),
    } as unknown as ArgumentsHost;
  });

  describe('catch', () => {
    it('should set the response status to the HTTP exception status and return the error body', () => {
      const mockExceptionResponse: HttpExceptionResponse = {
        statusCode: 404,
        error: 'Not Found',
        message: 'Error message',
        messages: [],
      };

      jest.spyOn(mockHttpException, 'getResponse').mockReturnValue(mockExceptionResponse);
      jest.spyOn(mockHttpException, 'getStatus').mockReturnValue(404);


      const actualResponse = filter.catch(mockHttpException, mockHost);

      expect(mockHost.switchToHttp).toHaveBeenCalled();
      expect(mockHttpArgHost.getResponse).toHaveBeenCalled();
      expect(mockHttpException.getResponse).toHaveBeenCalled();
      expect(mockHttpException.getStatus).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(actualResponse).toEqual(mockResponse);
    });

    it('should set the "messages" field in the error body when the HTTP exception response message is an array', () => {
      const mockExceptionResponse: HttpExceptionResponse = {
        statusCode: 404,
        error: 'Not Found',
        message: ['Error message 1', 'Error message 2'],
        messages: ['Error message 1', 'Error message 2'],
      };

      jest.spyOn(mockHttpException, 'getResponse').mockReturnValue(mockExceptionResponse);
      jest.spyOn(mockHttpException, 'getStatus').mockReturnValue(404);

      const actualResponse = filter.catch(mockHttpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(actualResponse).toEqual(mockResponse);
    });

    it('should set the "message" field in the error body when the HTTP exception response message is not an array', () => {
      const mockExceptionResponse: HttpExceptionResponse = {
        statusCode: 404,
        error: 'Not Found',
        message: 'Error message',
        messages: ['Error message'],
      };

      jest.spyOn(mockHttpException, 'getResponse').mockReturnValue(mockExceptionResponse);
      jest.spyOn(mockHttpException, 'getStatus').mockReturnValue(404);


      const actualResponse = filter.catch(mockHttpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(actualResponse).toEqual(mockResponse);
    });

    it('should return 500 if getStatus returns undefined', () => {
      const exception = new HttpException('test', 0);
      filter.catch(exception, mockHost);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  
    it('should return the status from getStatus if it is defined', () => {
      const exception = new HttpException('test', 404);
      filter.catch(exception, mockHost);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
