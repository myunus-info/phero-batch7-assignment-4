import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { categoryService } from './category.service';
import { sendResponse } from '../../../utils/sendResponse';
import httpStatus from 'http-status';

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newCategory = await categoryService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: newCategory,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await categoryService.getCategoriesFromDB(req.user?.id!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: categories,
  });
});

export const categoryController = {
  createCategory,
  getCategories,
};
