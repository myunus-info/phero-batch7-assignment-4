import { Router } from 'express';
import { userValidations } from './admin.validation';
import validateRequest from '../../middleware/validateRequest';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';
import { adminController } from './admin.controller';

const router = Router();

router.use(auth(Role.ADMIN));

router.get('/users', adminController.getAllUsers);
router.patch(
  '/users/:id',
  validateRequest(userValidations.userStatusUpdateSchema),
  adminController.updateUser,
);

router.get('/gear', adminController.getAllGearListings);
router.get('/rentals', adminController.getAllRentalOrders);

export const adminRoutes = router;
