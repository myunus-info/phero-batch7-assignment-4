import { Router } from 'express';
import { reviewController } from './review.controller';
import validateRequest from '../../middleware/validateRequest';
import { reviewValidation } from './review.validation';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router.post(
  '/',
  auth(Role.CUSTOMER),
  validateRequest(reviewValidation.createReviewValidationSchema),
  reviewController.createReview,
);

export const reviewRoutes = router;
