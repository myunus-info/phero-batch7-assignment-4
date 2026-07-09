import { z } from 'zod';

export const RentalStatusEnum = z.enum(['PLACED', 'CONFIRMED', 'PAID', 'PICKED_UP', 'RETURNED', 'CANCELLED']);

export const rentalOrderItemSchema = z.object({
  rentalOrderId: z.uuid(),
  gearItemId: z.uuid(),
  quantity: z.number().int().positive().default(1),
  pricePerDaySnapshot: z.coerce.number().nonnegative(),
  subtotal: z.coerce.number().nonnegative(),
});

export const rentalOrderSchema = z
  .object({
    customerId: z.uuid(),
    status: RentalStatusEnum.default('PLACED'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    totalAmount: z.coerce.number().nonnegative(),
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
