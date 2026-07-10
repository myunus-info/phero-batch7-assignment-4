import { prisma } from '../../../lib/prisma';
import ApiError from '../../errors/ApiError';
import { paymentService } from '../payment/payment.service';
import { TRentalOrder, TRentalOrderItem } from './order.interface';
import httpStatus from 'http-status';

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

const createRentalOrerIntoDB = async (payload: TRentalOrder, customerId: string) => {
  const numDays = daysBetween(new Date(payload.startDate), new Date(payload.endDate));
  const rentalOrder = await prisma.$transaction(async txt => {
    const gearIds = payload.items?.map(i => i.gearItemId);
    const gearItems = await txt.gearItem.findMany({ where: { id: { in: gearIds } } });

    if (gearItems.length !== gearIds?.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more gear items do not exist!');
    }

    let totalAmount = 0;
    const orderItemsData = (payload.items ?? []).map(reqItem => {
      const gear = gearItems.find(g => g.id === reqItem.gearItemId);

      if (!gear?.isActive) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Gear item "${gear?.name}" is no longer available`);
      }
      if (gear.quantityAvailable < reqItem.quantity) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for "${gear.name}". Available quantity: (${gear.quantityAvailable})`,
        );
      }

      const subtotal = Number(gear.pricePerDay) * reqItem.quantity * numDays;
      totalAmount += subtotal;

      return {
        gearItemId: gear.id,
        quantity: reqItem.quantity,
        pricePerDaySnapshot: gear.pricePerDay,
        subtotal,
      };
    });

    for (const reqItem of payload.items ?? []) {
      await txt.gearItem.update({
        where: { id: reqItem.gearItemId },
        data: { quantityAvailable: { decrement: reqItem.quantity } },
      });
    }

    const order = await txt.rentalOrder.create({
      data: {
        customerId,
        startDate: new Date(payload.startDate),
        endDate: new Date(payload.endDate),
        totalAmount,
        items: { create: orderItemsData },
      },
      include: { items: { include: { gearItem: true } } },
    });

    const user = await txt.user.findUniqueOrThrow({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    const paymentUrl = await paymentService.initiatePayment(user, order);

    await txt.payment.create({
      data: {
        amount: order.totalAmount,
        rentalOrderId: order.id,
      },
    });

    return {
      order,
      paymentUrl,
    };
  });

  return rentalOrder;
};

const getMyRentalOrdersFromDB = async (customerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: { customerId },
    include: {
      items: { include: { gearItem: { select: { id: true, name: true, images: true } } } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!orders || orders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No orders found!');
  }

  return orders;
};

const getRentalOrderByOrderIdFromDB = async (rentalOrderId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: {
      items: { include: { gearItem: true } },
      payments: true,
      customer: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Rental order not found!');
  }

  return order;
};

export const orderService = {
  createRentalOrerIntoDB,
  getMyRentalOrdersFromDB,
  getRentalOrderByOrderIdFromDB,
};
