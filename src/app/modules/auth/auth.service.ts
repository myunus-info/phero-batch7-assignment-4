import { compare } from 'bcryptjs';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { ILoginUser } from './auth.interface';
import { prisma } from '../../../lib/prisma';
import { jwtUtils } from '../../../utils/jwt';
import config from '../../../config';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { comparePassword } from '../../../utils/hash';

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

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt.jwt_refresh_secret);

  if (!verifiedRefreshToken.success) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  console.log({ verifiedRefreshToken });
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
  loginUser,
  refreshToken,
};
