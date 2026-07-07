import { Response } from 'express';
import { IErrorResponse } from '../app/errors';
import config from '../config';

export const sendErrorResponse = (res: Response, payload: IErrorResponse, stack?: string) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    error: payload.error,
    stack: config.env === 'development' ? stack : undefined,
  });
};
