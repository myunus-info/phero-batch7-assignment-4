import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { paymentService } from './payment.service';

const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId, tranId, status } = req.query as Record<string, string>;
  const data = { payload: req.body, orderId, tranId, status };

  const paymentData = await paymentService.confirmPayment(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment data retrieved!',
    data: paymentData,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const myPayments = await paymentService.getMyPaymentsFromDB(req.user?.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully!',
    data: myPayments,
  });
});

export const paymentController = {
  confirmPayment,
  getMyPayments,
};
