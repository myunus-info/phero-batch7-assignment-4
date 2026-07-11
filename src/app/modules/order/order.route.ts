import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { orderValidation } from './order.validation';
import { orderController } from './order.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router
  .route('/')
  .post(
    validateRequest(orderValidation.createRentalOrderValidationSchema),
    auth(Role.CUSTOMER),
    orderController.createRentalOrder,
  )
  .get(auth(Role.CUSTOMER), orderController.getMyRentalOrders);

router.get('/:id', auth(Role.CUSTOMER), orderController.getRentalOrderByOrderId);

export const orderRoutes = router;
