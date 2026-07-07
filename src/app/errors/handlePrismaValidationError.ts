import httpStatus from 'http-status';
import { Prisma } from '../../../generated/prisma/client';
import { IErrorResponse } from './errorTypes';

export const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError,
): IErrorResponse => {
  return {
    statusCode: httpStatus.BAD_REQUEST,
    success: false,
    message: 'Invalid request data.',
    error: err.message,
  };
};
