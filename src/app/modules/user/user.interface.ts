import { z } from 'zod';
import { UserStatusEnum } from './user.validation';

export type TUserStatus = z.infer<typeof UserStatusEnum>;
