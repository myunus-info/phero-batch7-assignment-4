import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { gearValidations } from './provider.validation';
import { Role } from '../../../../generated/prisma/enums';
import { auth } from '../../middleware/auth';
import { providerController } from './provider.controller';

const router = Router();

router.use(auth(Role.PROVIDER));

router
  .route('/gear')
  .post(validateRequest(gearValidations.createGearValidationSchema), providerController.addGear)
  .get(providerController.getMyGears);

router
  .route('/gear/:id')
  .get(providerController.getGearById)
  .put(validateRequest(gearValidations.updateGearValidationSchema), providerController.updateGear)
  .delete(providerController.deleteGear);

router.get('/orders', providerController.getProviderRentalOrders);
router.patch(
  '/orders/:id',
  validateRequest(gearValidations.updateProviderOrderStatusValidationSchema),
  providerController.updateProviderOrderStatus,
);

export const providerRoutes = router;
