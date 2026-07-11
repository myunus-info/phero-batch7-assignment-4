import { z } from 'zod';

export const createReviewSchema = z.object({
  rentalOrderId: z.uuid(),
  gearItemId: z.uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

const createReviewValidationSchema = z.object({
  body: createReviewSchema,
});

export const reviewValidation = {
  createReviewValidationSchema,
};
