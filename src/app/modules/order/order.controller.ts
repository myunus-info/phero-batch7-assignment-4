import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { orderService } from './order.service';

const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id!;
  const newOrder = await orderService.createRentalOrerIntoDB(req.body, customerId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rental order created successfully!',
    data: newOrder,
  });
});

const getMyRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const rentalOrders = await orderService.getMyRentalOrdersFromDB(req.user?.id!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental orders retrieved successfully!',
    data: rentalOrders,
  });
});

const getRentalOrderByOrderId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const order = await orderService.getRentalOrderByOrderIdFromDB(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental order retrieved successfully!',
    data: order,
  });
});

export const orderController = {
  createRentalOrder,
  getMyRentalOrders,
  getRentalOrderByOrderId,
};
