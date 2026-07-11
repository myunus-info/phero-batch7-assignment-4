import { prisma } from '../../../lib/prisma';

const getAllGearsFromDB = async () => {
  const gears = await prisma.gearItem.findMany();
  return gears;
};

const getGearByIdFromDB = async (gearId: string) => {};

export const gearService = {
  getAllGearsFromDB,
  getGearByIdFromDB,
};
