import { z } from 'zod';
import { updateProviderOrderStatusSchema } from './provider.validation';

export type GearCondition = 'NEW' | 'GOOD' | 'FAIR' | 'WORN';

export interface ICreateGearItemInput {
  categoryId: string;
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number;
  depositAmount?: number;
  quantityTotal: number;
  condition?: GearCondition;
  images?: string[];
}

export interface IUpdateGearItemInput {
  categoryId?: string;
  name?: string;
  description?: string;
  brand?: string;
  pricePerDay?: number;
  depositAmount?: number;
  quantityTotal?: number;
  quantityAvailable?: number;
  condition?: GearCondition;
  images?: string[];
  isActive?: boolean;
}

export type TupdateOrderStatus = z.infer<typeof updateProviderOrderStatusSchema>;
