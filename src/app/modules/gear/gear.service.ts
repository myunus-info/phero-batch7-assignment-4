import { GearItemWhereInput } from './../../../../generated/prisma/models/GearItem';
import { GearCondition } from './../../../../generated/prisma/enums';
import { prisma } from '../../../lib/prisma';
import { IGearQuery } from './gear.interface';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

const getAllGearsFromDB = async (query: IGearQuery) => {
  const { search, category, brand, price, condition, sortBy, sortOrder } = query;
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const priceValue = price === undefined || price === null || price === '' ? undefined : Number(price);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Page and limit must be positive integers');
  }

  if (priceValue !== undefined && (!Number.isFinite(priceValue) || priceValue < 0)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Price must be a non-negative number');
  }

  const allowedSortFields = ['createdAt', 'name', 'pricePerDay'] as const;
  const requestedSortBy = sortBy?.trim() || 'createdAt';
  const requestedSortOrder = sortOrder?.trim().toLowerCase() || 'desc';

  if (!allowedSortFields.includes(requestedSortBy as (typeof allowedSortFields)[number])) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid sort field');
  }

  if (requestedSortOrder !== 'asc' && requestedSortOrder !== 'desc') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sort order must be asc or desc');
  }

  const searchTerm = search?.trim();
  const categoryName = category?.trim();
  const brandName = brand?.trim();
  const conditionValue = condition?.trim().toUpperCase();

  if (conditionValue && !Object.values(GearCondition).includes(conditionValue as GearCondition)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid gear condition');
  }

  const where: GearItemWhereInput = {
    isActive: true,
    ...(searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { brand: { contains: searchTerm, mode: 'insensitive' } },
            { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
          ],
        }
      : {}),
    ...(categoryName ? { category: { name: { equals: categoryName, mode: 'insensitive' } } } : {}),
    ...(brandName ? { brand: { equals: brandName, mode: 'insensitive' } } : {}),
    ...(conditionValue ? { condition: { equals: conditionValue as GearCondition } } : {}),
    ...(priceValue !== undefined ? { pricePerDay: { equals: priceValue } } : {}),
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
      orderBy: [{ [requestedSortBy]: requestedSortOrder }, { id: 'asc' }],
    }),
    prisma.gearItem.count({ where }),
  ]);

  return {
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getGearByIdFromDB = async (gearId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });

  if (!gear) throw new ApiError(httpStatus.NOT_FOUND, `The gear item with id ${gearId} not found!`);

  return gear;
};

export const gearService = {
  getAllGearsFromDB,
  getGearByIdFromDB,
};
