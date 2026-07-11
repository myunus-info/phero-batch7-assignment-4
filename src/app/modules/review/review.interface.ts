import { z } from 'zod';
import { createReviewSchema } from './review.validation';

export type TReview = z.infer<typeof createReviewSchema>;
