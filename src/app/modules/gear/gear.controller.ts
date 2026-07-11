import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { gearService } from './gear.service';
import pick from '../../../shared/shared';

const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, ['category', 'price', 'brand', 'page', 'limit']);

  const result = await gearService.getAllGearsFromDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear items retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id as string;

  const gear = await gearService.getGearByIdFromDB(gearId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear item retrieved successfully',
    data: gear,
  });
});

export const gearController = {
  getAllGears,
  getGearById,
};
