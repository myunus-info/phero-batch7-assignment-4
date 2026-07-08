import { prisma } from '../../../lib/prisma';
import ApiError from '../../errors/ApiError';
import { ICreateCategoryInput } from './category.interface';
import httpStatus from 'http-status';

const createCategoryIntoDB = async (payload: ICreateCategoryInput) => {
  const existing = await prisma.category.findUnique({ where: { name: payload.name } });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Category already exists');

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
    },
  });

  return category;
};

const getCategoriesFromDB = async (id: string) => {
  const categories = await prisma.category.findMany({
    where: { id },
    orderBy: { name: 'asc' },
    include: { _count: { select: { gearItems: true } } },
  });

  if (!categories || !categories.length)
    throw new ApiError(httpStatus.NOT_FOUND, 'Categories not found!');

  return categories;
};

export const categoryService = {
  createCategoryIntoDB,
  getCategoriesFromDB,
};
