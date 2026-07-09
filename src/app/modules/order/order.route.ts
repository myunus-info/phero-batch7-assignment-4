import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { orderValidation } from './order.validation';
import { orderController } from './order.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router.use(auth(Role.CUSTOMER));

router
  .route('/')
  .post(validateRequest(orderValidation.createRentalOrderValidationSchema), orderController.createRentalOrder)
  .get(orderController.getMyRentalOrders);

router.get('/:id', orderController.getRentalOrderByOrderId);

export const orderRoutes = router;
