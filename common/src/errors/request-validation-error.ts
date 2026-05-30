import { type ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): Array<{ message: string; field?: string }> {
    return this.errors.map((err) => ({
      message: err.msg as string,
      field: 'param' in err ? err.param : undefined
    }));
  }
}
