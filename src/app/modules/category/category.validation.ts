import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters'),
    description: z
      .string()
      .trim()
      .max(1000, 'Description must be at most 1000 characters')
      .optional(),
  }),
});

export const categoryValidations = {
  createCategoryValidationSchema,
};
