import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { reviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const customerId = req.user!.id;

  const review = await reviewService.createRewiewIntoDB(payload, customerId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully!',
    data: review,
  });
});

export const reviewController = {
  createReview,
};
