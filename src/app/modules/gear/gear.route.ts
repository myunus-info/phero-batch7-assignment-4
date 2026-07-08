import { Router } from 'express';
import { gearController } from './gear.controller';
import validateRequest from '../../middleware/validateRequest';
import { gearValidations } from './gear.validation';
import { Role } from '../../../../generated/prisma/enums';
import { auth } from '../../middleware/auth';

const router = Router();

router.use(auth(Role.PROVIDER));

router
  .route('/')
  .post(validateRequest(gearValidations.createGearValidationSchema), gearController.addGear)
  .get(gearController.getMyGears);

router
  .route('/:id')
  .get(gearController.getGearById)
  .put(validateRequest(gearValidations.updateGearValidationSchema), gearController.updateGear)
  .delete(gearController.deleteGear);

export const gearRoutes = router;
