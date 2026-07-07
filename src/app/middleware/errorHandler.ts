import { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import { ZodError } from 'zod';

import {
  handleApiError,
  handlePrismaError,
  handlePrismaValidationError,
  handleUnknownError,
  handleZodError,
} from '../errors';

import { sendErrorResponse } from '../../utils/sendErrorResponse';
import ApiError from '../errors/ApiError';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorResponse;

  if (err instanceof ApiError) {
    errorResponse = handleApiError(err);
  } else if (err instanceof ZodError) {
    errorResponse = handleZodError(err);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    errorResponse = handlePrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    errorResponse = handlePrismaValidationError(err);
  } else {
    errorResponse = handleUnknownError(err);
  }

  sendErrorResponse(res, errorResponse, err instanceof Error ? err.stack : undefined);
};
