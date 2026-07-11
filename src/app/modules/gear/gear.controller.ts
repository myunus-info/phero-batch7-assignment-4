import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { gearService } from './gear.service';

const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gears = await gearService.getAllGearsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gears retrieved successfully',
    data: gears,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id as string;

  const gear = await gearService.getGearByIdFromDB(gearId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear retrieved successfully',
    data: gear,
  });
});

export const gearController = {
  getAllGears,
  getGearById,
};
