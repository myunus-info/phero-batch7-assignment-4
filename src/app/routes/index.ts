import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { adminRoutes } from '../modules/admin/admin.route';
import { categoryRoutes } from '../modules/category/category.route';
import { providerRoutes } from '../modules/provider/provider.route';
import { orderRoutes } from '../modules/order/order.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { reviewRoutes } from '../modules/review/review.route';
import { gearRoutes } from '../modules/gear/gear.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/gears',
    route: gearRoutes,
  },
  {
    path: '/provider',
    route: providerRoutes,
  },
  {
    path: '/rentals',
    route: orderRoutes,
  },
  {
    path: '/payments',
    route: paymentRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
