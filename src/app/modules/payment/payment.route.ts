import { Router } from 'express';
import { paymentController } from './payment.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();

router.use(auth(Role.CUSTOMER));

router.route('/').post(paymentController.confirmPayment).get(paymentController.getMyPayments);

export const paymentRoutes = router;
