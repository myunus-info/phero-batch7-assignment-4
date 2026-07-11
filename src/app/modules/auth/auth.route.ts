import { Router } from 'express';
import { authController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { authValidations } from './auth.validation';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router.post(
  '/register',
  validateRequest(authValidations.registerUserValidationSchema),
  authController.registerUser,
);
router.post('/login', validateRequest(authValidations.loginUserValidationSchema), authController.loginUser);
router.get('/me', auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), authController.getMe);
router.post('/refresh-token', authController.refreshToken);

export const authRoutes = router;
