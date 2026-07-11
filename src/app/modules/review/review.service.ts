import { prisma } from '../../../lib/prisma';
import ApiError from '../../errors/ApiError';
import { TReview } from './review.interface';
import httpStatus from 'http-status';

const createRewiewIntoDB = async (payload: TReview, customerId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: payload.rentalOrderId },
    include: { items: true },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  if (order.customerId !== customerId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not your order!');
  }

  if (order.status === 'CANCELLED') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot review a cancelled rental order');
  }
  if (order.status !== 'RETURNED') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only review gear after the rental has been returned');
  }

  const rentedThisGear = order.items.some(item => item.gearItemId === payload.gearItemId);
  if (!rentedThisGear) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This gear item was not part of the specified rental order');
  }

  const existing = await prisma.review.findUnique({
    where: {
      customerId_gearItemId_rentalOrderId: {
        customerId,
        gearItemId: payload.gearItemId,
        rentalOrderId: payload.rentalOrderId,
      },
    },
  });

  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'This gear item was not part of the specified rental order');
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      gearItemId: payload.gearItemId,
      rentalOrderId: payload.rentalOrderId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return review;
};

export const reviewService = {
  createRewiewIntoDB,
};
