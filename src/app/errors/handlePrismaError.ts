import httpStatus from 'http-status';
import { Prisma } from '../../../generated/prisma/client';
import { IErrorResponse } from './errorTypes';

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): IErrorResponse => {
  switch (err.code) {
    case 'P2002':
      return {
        statusCode: httpStatus.CONFLICT,
        success: false,
        message: 'Duplicate record.',
        error: err.meta,
      };

    case 'P2025':
      return {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: 'Record not found.',
        error: err.meta,
      };

    default:
      return {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Database error.',
        error: err.meta,
      };
  }
};
