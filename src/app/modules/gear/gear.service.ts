import { prisma } from '../../../lib/prisma';
import ApiError from '../../errors/ApiError';
import { ICreateGearItemInput, IUpdateGearItemInput } from './gear.interface';
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

  if (!myGears || myGears.length === 0)
    throw new ApiError(httpStatus.NOT_FOUND, 'No gear items found!');

  return myGears;
};

const getGearByIdFromDB = async (gearItemId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id: gearItemId },
    include: { category: true },
  });

  if (!gear) throw new ApiError(httpStatus.NOT_FOUND, 'No gear item found!');

  return gear;
};

const updateGearIntoDB = async (payload: IUpdateGearItemInput, gearItemId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearItemId } });
  if (!gear) throw new ApiError(httpStatus.NOT_FOUND, 'Gear item not found');

  const updated = await prisma.gearItem.update({
    where: { id: gearItemId },
    data: payload,
  });

  return updated;
};

const deleteGearFromDB = async (gearItemId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearItemId } });
  if (!gear) throw new ApiError(httpStatus.NOT_FOUND, 'Gear item not found');

  const deleted = await prisma.gearItem.delete({ where: { id: gearItemId } });

  return deleted;
};

export const gearService = {
  addGearIntoDB,
  getMyGearsFromDB,
  getGearByIdFromDB,
  updateGearIntoDB,
  deleteGearFromDB,
};
