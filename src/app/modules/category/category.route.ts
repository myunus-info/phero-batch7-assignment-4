import { Router } from 'express';
import { categoryController } from './category.controller';
import validateRequest from '../../middleware/validateRequest';
import { categoryValidations } from './category.validation';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router
  .route('/')
  .post(
    validateRequest(categoryValidations.createCategoryValidationSchema),
    auth(Role.PROVIDER),
    categoryController.createCategory,
  )
  .get(auth(Role.PROVIDER), categoryController.getCategories);

export const categoryRoutes = router;
