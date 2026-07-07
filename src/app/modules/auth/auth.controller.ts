import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { authService } from './auth.service';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000, // 1d
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Login successful!',
    data: { accessToken, refreshToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  const { accessToken } = await authService.refreshToken(refreshToken);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000, // 1d
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Token refreshed successfully',
    data: { accessToken },
  });
});

export const authController = {
  loginUser,
  refreshToken,
};
