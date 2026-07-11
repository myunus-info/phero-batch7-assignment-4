import { z } from 'zod';

export const GearConditionEnum = z.enum(['NEW', 'GOOD', 'FAIR', 'WORN']);

const nameSchema = z.string().trim().min(2, 'Name must be at least 2 characters').max(150);
const descriptionSchema = z.string().trim().max(2000).optional();
const brandSchema = z.string().trim().max(100).optional();
const pricePerDaySchema = z.number().positive('pricePerDay must be greater than 0');
const depositAmountSchema = z.number().nonnegative('depositAmount cannot be negative').optional();
const imagesSchema = z.array(z.url('Each image must be a valid URL')).max(10).optional();

export const updateProviderOrderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED']),
});

export const createGearValidationSchema = z.object({
  body: z.object({
    categoryId: z.uuid('Invalid categoryId'),
    name: nameSchema,
    description: descriptionSchema,
    brand: brandSchema,
    pricePerDay: pricePerDaySchema,
    depositAmount: depositAmountSchema,
    quantityTotal: z.number().int().positive('quantityTotal must be at least 1'),
    condition: GearConditionEnum.optional(),
    images: imagesSchema,
  }),
});

export const updateGearValidationSchema = z.object({
  body: z
    .object({
      categoryId: z.string().uuid('Invalid categoryId').optional(),
      name: nameSchema.optional(),
      description: descriptionSchema,
      brand: brandSchema,
      pricePerDay: pricePerDaySchema.optional(),
      depositAmount: depositAmountSchema,
      quantityTotal: z.number().int().positive('quantityTotal must be at least 1').optional(),
      quantityAvailable: z.number().int().nonnegative('quantityAvailable cannot be negative').optional(),
      condition: GearConditionEnum.optional(),
      images: imagesSchema,
      isActive: z.boolean().optional(),
    })
    .refine(data => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    })
    .refine(
      data =>
        data.quantityTotal === undefined ||
        data.quantityAvailable === undefined ||
        data.quantityAvailable <= data.quantityTotal,
      {
        message: 'quantityAvailable cannot exceed quantityTotal',
        path: ['quantityAvailable'],
      },
    ),
});

const updateProviderOrderStatusValidationSchema = z.object({
  body: updateProviderOrderStatusSchema,
});

export const gearValidations = {
  createGearValidationSchema,
  updateGearValidationSchema,
  updateProviderOrderStatusValidationSchema,
};
