import { z } from 'zod';

const emailSchema = z.email('Invalid email address').trim().toLowerCase().max(150);
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72) // bcrypt truncates beyond 72 bytes
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

const loginUserValidationSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const authValidations = {
  loginUserValidationSchema,
};
