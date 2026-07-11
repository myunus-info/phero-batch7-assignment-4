import { z } from 'zod';

export const UserStatusEnum = z.enum(['ACTIVE', 'SUSPENDED']);

const userStatusUpdateSchema = z.object({
  body: z.object({
    status: UserStatusEnum,
  }),
});

export const userValidations = {
  userStatusUpdateSchema,
};
