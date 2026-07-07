import ApiError from './ApiError';
import { IErrorResponse } from './errorTypes';

export const handleApiError = (err: ApiError): IErrorResponse => {
  return {
    statusCode: err.statusCode,
    success: false,
    message: err.message,
    error: null,
  };
};
