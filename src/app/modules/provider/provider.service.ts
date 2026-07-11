import { prisma } from '../../../lib/prisma';
import ApiError from '../../errors/ApiError';
import { ICreateGearItemInput, IUpdateGearItemInput, TupdateOrderStatus } from './provider.interface';
import httpStatus from 'http-status';

const addGearIntoDB = async (payload: ICreateGearItemInput, id: string) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid categoryId');

  const newGear = await prisma.gearItem.create({
    data: {
      providerId: id,
      categoryId: payload.categoryId,
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      pricePerDay: payload.pricePerDay,
      depositAmount: payload.depositAmount,
      quantityTotal: payload.quantityTotal,
      quantityAvailable: payload.quantityTotal,
      condition: payload.condition,
      images: payload.images || [],
    },
  });

  return newGear;
};

const getMyGearsFromDB = async (providerId: string) => {
  const myGears = await prisma.gearItem.findMany({
    where: { providerId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!myGears || myGears.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'No gear items found!');

  return myGears;
};

const getGearByIdFromDB = async (gearItemId: string, providerId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id: gearItemId },
    include: { category: true },
  });

  if (!gear) throw new ApiError(httpStatus.NOT_FOUND, 'No gear item found!');
  if (gear.providerId !== providerId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this gear item!');
  }

  return gear;
};

const updateGearIntoDB = async (payload: IUpdateGearItemInput, gearItemId: string, providerId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearItemId } });
  if (!gear) throw new ApiError(httpStatus.NOT_FOUND, 'Gear item not found');

  if (gear.providerId !== providerId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this gear item!');
  }

  const updated = await prisma.gearItem.update({
    where: { id: gearItemId },
    data: payload,
  });

  return updated;
};

const deleteGearFromDB = async (gearItemId: string, providerId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearItemId } });

  if (!gear) throw new ApiError(httpStatus.NOT_FOUND, 'Gear item not found');
  if (gear.providerId !== providerId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this gear item!');
  }

  const deleted = await prisma.gearItem.delete({ where: { id: gearItemId } });

  return deleted;
};

const getProviderOrdersFromDB = async (providerId: string) => {
  const rentalOrders = await prisma.rentalOrder.findMany({
    where: {
      items: {
        some: { gearItem: { providerId } },
      },
    },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      items: {
        where: { gearItem: { providerId } },
        include: { gearItem: true },
      },
      payments: true,
    },
  });

  return rentalOrders;
};

const updateProviderOrderStatusIntoDB = async (status: string, orderId: string, providerId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: { items: { include: { gearItem: true } } },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Rental order not found!');
  }

  const ownsOrder = order.items.some(item => item.gearItem.providerId === providerId);
  if (!ownsOrder) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have gear in this order!');
  }

  const validTransitions: Record<string, string[]> = {
    PLACED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PICKED_UP', 'CANCELLED'],
    PAID: ['PICKED_UP'],
    PICKED_UP: ['RETURNED'],
  };

  const allowed = validTransitions[order.status] || [];
  if (!allowed.includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot transition order from ${order.status} to ${status}`);
  }

  const updateData: Record<string, unknown> = { status };
  if (status === 'PICKED_UP') updateData.pickupConfirmedAt = new Date();
  if (status === 'RETURNED') updateData.returnConfirmedAt = new Date();
  if (status === 'CANCELLED') updateData.cancelledAt = new Date();

  const updated = await prisma.$transaction(async tx => {
    const result = await tx.rentalOrder.update({
      where: { id: orderId },
      data: updateData,
    });

    if (status === 'RETURNED' || status === 'CANCELLED') {
      for (const item of order.items) {
        await tx.gearItem.update({
          where: { id: item.gearItemId },
          data: { quantityAvailable: { increment: item.quantity } },
        });
      }
    }
    return result;
  });

  return updated;
};

export const providerService = {
  addGearIntoDB,
  getMyGearsFromDB,
  getGearByIdFromDB,
  updateGearIntoDB,
  deleteGearFromDB,
  getProviderOrdersFromDB,
  updateProviderOrderStatusIntoDB,
};
