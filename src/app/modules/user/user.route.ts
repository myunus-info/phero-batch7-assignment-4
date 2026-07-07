import { Router } from 'express';
import { userController } from './user.controller';
import { userValidations } from './user.validation';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/register',
  validateRequest(userValidations.registerUserValidationSchema),
  userController.registerUser,
);
router.get('/me', userController.getMe);

export const userRoutes = router;
