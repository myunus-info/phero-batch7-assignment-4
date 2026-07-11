import { Router } from 'express';
import { userController } from './user.controller';
import { userValidations } from './user.validation';
import validateRequest from '../../middleware/validateRequest';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router.get('/', auth(Role.ADMIN), userController.getAllUsers);
router.get(
  '/:id',
  validateRequest(userValidations.userStatusUpdateSchema),
  auth(Role.ADMIN),
  userController.updateUser,
);

export const userRoutes = router;
