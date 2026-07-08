import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { gearService } from './gear.service';

const addGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newGear = await gearService.addGearIntoDB(req.body, req.user?.id!);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Gear item created successfully!',
    data: newGear,
  });
});

const getMyGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const myGears = await gearService.getMyGearsFromDB(req.user?.id!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear items retrieved successfully!',
    data: myGears,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const gear = await gearService.getGearByIdFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear item retrieved successfully!',
    data: gear,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

export const gearController = {
  addGear,
  getMyGears,
  getGearById,
  updateGear,
  deleteGear,
};
