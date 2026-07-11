import { z } from 'zod';
import { UserStatusEnum } from './admin.validation';

export type TUserStatus = z.infer<typeof UserStatusEnum>;
