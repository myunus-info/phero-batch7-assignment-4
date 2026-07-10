import { RentalOrder } from '../../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import { initPayment, TUser, verifyPayment } from '../../../lib/sslcommerz';
import ApiError from '../../errors/ApiError';
import { TPaymentConfirmData } from './payment.interface';
import httpStatus from 'http-status';

const initiatePayment = async (user: TUser, order: RentalOrder) => {
  const paymentUrl = await initPayment(user, order);

  if (!paymentUrl) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment url not found!');
  }

  return paymentUrl;
};

const confirmPayment = async (data: TPaymentConfirmData) => {
  const { payload, orderId, tranId } = data;

  const response = await verifyPayment(payload.val_id as string);

  await prisma.$transaction(async txt => {
    await txt.payment.update({
      where: { rentalOrderId: orderId },
      data: {
        transactionId: tranId,
        status: 'PAID',
        method: response.card_type,
        gatewayResponse: response,
        paidAt: new Date(payload.tran_date as string),
      },
    });

    await txt.rentalOrder.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    });
  });

  return response;
};

export const paymentService = {
  initiatePayment,
  confirmPayment,
};
