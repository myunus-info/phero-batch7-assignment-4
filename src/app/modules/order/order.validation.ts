import { z } from 'zod';

export const RentalStatusEnum = z.enum(['PLACED', 'CONFIRMED', 'PAID', 'PICKED_UP', 'RETURNED', 'CANCELLED']);

export const rentalOrderItemSchema = z.object({
  gearItemId: z.uuid(),
  quantity: z.number().int().positive().default(1),
});

export const rentalOrderSchema = z
  .object({
    status: RentalStatusEnum.default('PLACED'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    items: z.array(rentalOrderItemSchema).optional(),
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  });

const createRentalOrderValidationSchema = z.object({
  body: rentalOrderSchema,
});

const createRentalOrderItemValidationSchema = z.object({
  body: rentalOrderItemSchema,
});

export const orderValidation = {
  createRentalOrderValidationSchema,
  createRentalOrderItemValidationSchema,
};
