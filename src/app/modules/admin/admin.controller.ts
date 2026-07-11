import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { adminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await adminService.getUsersFromDB();

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
  const updated = await adminService.updateUserStatusIntoDB(status, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully',
    data: updated,
  });
});

const getAllGearListings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearListings = await adminService.getAllGearListings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear Listings retrieved successfully',
    data: gearListings,
  });
});

const getAllRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const rentalOrders = await adminService.getAllRentalOrders();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental orders retrieved successfully',
    data: rentalOrders,
  });
});

export const adminController = {
  getAllUsers,
  updateUser,
  getAllGearListings,
  getAllRentalOrders,
};
