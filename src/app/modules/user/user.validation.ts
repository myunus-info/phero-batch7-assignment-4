import { z } from 'zod';

// ============================================================
// ENUMS — mirror Prisma enums so Zod and DB stay in sync
// ============================================================

export const RoleEnum = z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']);
// export type Role = z.infer<typeof RoleEnum>;

export const UserStatusEnum = z.enum(['ACTIVE', 'SUSPENDED']);
// export type UserStatus = z.infer<typeof UserStatusEnum>;

// ============================================================
// SHARED FIELD RULES
// ============================================================

const nameSchema = z.string().trim().min(2, 'Name must be at least 2 characters').max(100);
const emailSchema = z.string().trim().toLowerCase().email('Invalid email address').max(150);
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72) // bcrypt truncates beyond 72 bytes
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number')
  .optional();
const addressSchema = z.string().trim().max(500).optional();
const avatarUrlSchema = z.url('avatarUrl must be a valid URL').optional();

// ============================================================
// REGISTER / CREATE USER
// ============================================================

const registerUserValidationSchema = z.object({
  body: z
    .object({
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      role: RoleEnum.exclude(['ADMIN']), // admins are never self-registered
      phone: phoneSchema,
      address: addressSchema,
      avatarUrl: avatarUrlSchema,
      // Only required/used when role === 'PROVIDER'; validated below
      shopName: z.string().trim().min(2).max(150).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.role === 'PROVIDER' && !data.shopName) {
        ctx.addIssue({
          code: 'custom',
          message: 'shopName is required when registering as a provider',
          path: ['shopName'],
        });
      }
    }),
});

export const userValidations = {
  registerUserValidationSchema,
};
