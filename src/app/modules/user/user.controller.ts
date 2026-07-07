import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { userService } from './user.service';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, role } = req.user!;
  const user = await userService.getMeFromDB(id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
});

export const userController = {
  registerUser,
  getMe,
};
