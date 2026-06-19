import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/role.middleware.js';
import { SystemConfigController } from '../../controllers/admin/systemConfig.controller.js';
import { createSystemConfigSchema, updateSystemConfigSchema } from '../../validations/systemConfig.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
const router = Router();
router.use(verifyToken, requireRoles(['admin']));
router.get('/', SystemConfigController.getAll);
router.post('/', validate(createSystemConfigSchema), SystemConfigController.create);
router.put('/:id', validate(updateSystemConfigSchema), SystemConfigController.update);
router.delete('/:id', SystemConfigController.remove);
export default router;
//# sourceMappingURL=systemConfig.route.js.map