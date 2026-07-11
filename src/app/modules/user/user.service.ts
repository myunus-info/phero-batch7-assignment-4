import { prisma } from '../../../lib/prisma';
import { TUserStatus } from './user.interface';
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

export const userService = {
  getUsersFromDB,
  updateUserStatusIntoDB,
};
