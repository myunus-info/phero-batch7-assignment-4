import httpStatus from 'http-status';
import { IErrorResponse } from './errorTypes';

export const handleUnknownError = (err: unknown): IErrorResponse => {
  if (err instanceof Error) {
    return {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      error: null,
    };
  }

  return {
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    message: 'Something went wrong.',
    error: null,
  };
};
