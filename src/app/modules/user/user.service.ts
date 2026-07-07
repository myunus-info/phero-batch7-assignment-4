import { prisma } from '../../../lib/prisma';
import { TRegisterUserInput } from './user.interface';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { hashPassword } from '../../../utils/hash';

const registerUserIntoDB = async (payload: TRegisterUserInput) => {
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: await hashPassword(payload.password),
      role: payload.role,
      phone: payload.phone,
      address: payload.address,
      ...(payload.role === 'PROVIDER'
        ? {
            providerProfile: {
              create: { shopName: payload.shopName || `${payload.name}'s Shop` },
            },
          }
        : {}),
    },
    omit: { password: true },
    include: { providerProfile: payload.role === 'PROVIDER' },
  });

  return newUser;
};

const getMeFromDB = async (id: string, role: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: false },
    include: {
      providerProfile: role === 'PROVIDER',
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  return user;
};

export const userService = {
  registerUserIntoDB,
  getMeFromDB,
};
