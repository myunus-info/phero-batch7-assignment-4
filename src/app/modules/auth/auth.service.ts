import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { ILoginUser, TRegisterUserInput } from './auth.interface';
import { prisma } from '../../../lib/prisma';
import { jwtUtils } from '../../../utils/jwt';
import config from '../../../config';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { comparePassword, hashPassword } from '../../../utils/hash';

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

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  if (user.status === 'SUSPENDED') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been suspended!');
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret,
    config.jwt.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.generateToken(
    jwtPayload,
    config.jwt.jwt_refresh_secret,
    config.jwt.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
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

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt.jwt_refresh_secret);

  if (!verifiedRefreshToken.success) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  if (user.status === 'SUSPENDED') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been suspended!');
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret,
    config.jwt.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

export const authService = {
  registerUserIntoDB,
  loginUser,
  getMeFromDB,
  refreshToken,
};
