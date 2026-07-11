import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { userService } from './user.service';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const { id } = req.params;
  const updated = await userService.updateUserStatusIntoDB(status, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully',
    data: updated,
  });
});

export const userController = {
  getAllUsers,
  updateUser,
};
