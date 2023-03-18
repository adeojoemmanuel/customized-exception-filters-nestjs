export interface HttpExceptionResponse {
  readonly statusCode: number;

  readonly error: string;

  readonly message: unknown;

  readonly messages: unknown[];
}

export interface AllException {
  readonly response: object
}

export interface ExceptionResponse {
  readonly statusCode: number;

  readonly error: string;

  readonly message: unknown;

  readonly messages: unknown[];
}
