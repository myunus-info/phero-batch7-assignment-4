import { Router } from 'express';
import { authController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { authValidations } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidations.loginUserValidationSchema),
  authController.loginUser,
);
router.post('/refresh-token', authController.refreshToken);

export const authRoutes = router;
