import { z } from 'zod';
import { rentalOrderItemSchema, rentalOrderSchema, RentalStatusEnum } from './order.validation';

export type TRentalOrder = z.infer<typeof rentalOrderSchema>;
export type TRentalOrderItem = z.infer<typeof rentalOrderItemSchema>;
export type TRentalStatus = z.infer<typeof RentalStatusEnum>;
