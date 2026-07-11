import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { providerService } from './provider.service';
import { IUpdateGearItemInput } from './provider.interface';

const addGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newGear = await providerService.addGearIntoDB(req.body, req.user?.id!);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Gear item created successfully!',
    data: newGear,
  });
});

const getMyGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const myGears = await providerService.getMyGearsFromDB(req.user?.id!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear items retrieved successfully!',
    data: myGears,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const providerId = req.user?.id as string;
  const gear = await providerService.getGearByIdFromDB(id as string, providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear item retrieved successfully!',
    data: gear,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const providerId = req.user?.id as string;
  const payload = req.body as IUpdateGearItemInput;
  const updated = await providerService.updateGearIntoDB(payload, id as string, providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear item updated successfully!',
    data: updated,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const providerId = req.user?.id as string;
  const deleted = await providerService.deleteGearFromDB(id as string, providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gear item deleted successfully!',
    data: deleted,
  });
});

const getProviderRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const providerOrders = await providerService.getProviderOrdersFromDB(req.user?.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Provider rental orders retrieved successfully!',
    data: providerOrders,
  });
});

const updateProviderOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;

  const updated = await providerService.updateProviderOrderStatusIntoDB(
    status,
    req.params.id as string,
    req.user?.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Provider rental order updated successfully!',
    data: updated,
  });
});

export const providerController = {
  addGear,
  getMyGears,
  getGearById,
  updateGear,
  deleteGear,
  getProviderRentalOrders,
  updateProviderOrderStatus,
};
