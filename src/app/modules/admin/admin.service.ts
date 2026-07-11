import { prisma } from '../../../lib/prisma';
import { TUserStatus } from './admin.interface';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

const getUsersFromDB = async () => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

  if (!users || users.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'Users not found!');

  return users;
};

const updateUserStatusIntoDB = async (status: TUserStatus, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: false },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const updated = await prisma.user.update({ where: { id: userId }, data: { status } });

  return updated;
};

const getAllGearListings = async () => {
  const gearListings = await prisma.gearItem.findMany({
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!gearListings || gearListings.length === 0)
    throw new ApiError(httpStatus.NOT_FOUND, 'No gear listing found!');

  return gearListings;
};

const getAllRentalOrders = async () => {
  const rentals = await prisma.rentalOrder.findMany({
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: { include: { gearItem: { select: { id: true, name: true, providerId: true } } } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!rentals || rentals.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'No rental order found!');

  return rentals;
};

export const adminService = {
  getUsersFromDB,
  updateUserStatusIntoDB,
  getAllGearListings,
  getAllRentalOrders,
};
