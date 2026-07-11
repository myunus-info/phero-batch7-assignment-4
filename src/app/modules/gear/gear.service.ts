import { GearItemWhereInput } from './../../../../generated/prisma/models/GearItem';
import { prisma } from '../../../lib/prisma';
import { IGearQuery } from './gear.interface';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

const getAllGearsFromDB = async (query: IGearQuery) => {
  const { category, brand, price, page = 1, limit = 5 } = query;

  const where: GearItemWhereInput = {
    isActive: true,
    ...(category ? { category: { name: { equals: category, mode: 'insensitive' } } } : {}),
    ...(brand ? { brand: { equals: brand, mode: 'insensitive' } } : {}),
    ...(price ? { pricePerDay: { equals: price } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.gearItem.findMany({
      where,
      include: {
        category: true,
        provider: { select: { id: true, name: true } },
        _count: { select: { reviews: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.gearItem.count({ where }),
  ]);

  if (!items || items.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'No gear item found!');

  return {
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getGearByIdFromDB = async (gearId: string) => {};

export const gearService = {
  getAllGearsFromDB,
  getGearByIdFromDB,
};
