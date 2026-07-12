import { Router } from 'express';
import { paymentController } from './payment.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router.post('/', paymentController.confirmPayment);

router.use(auth(Role.CUSTOMER));

router.get('/', paymentController.getMyPayments);

router.get('/:id', paymentController.getPaymentById);

export const paymentRoutes = router;
