import httpStatus from 'http-status';
import { ZodError } from 'zod';
import { IErrorResponse } from './errorTypes';

export const handleZodError = (err: ZodError): IErrorResponse => ({
  statusCode: httpStatus.BAD_REQUEST,
  success: false,
  message: 'Validation failed',
  error: err.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  })),
});
