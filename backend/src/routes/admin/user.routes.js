import { Router } from 'express';
import { UserController } from '../../controllers/admin/user.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/role.middleware.js';
import { createStaffSchema, toggleUserStatusSchema } from '../../validations/user.validation.js';
const router = Router();
router.use(verifyToken);
router.get('/search-phone', UserController.searchUserByPhone);
router.get('/', requireRoles(['admin']), UserController.getAll);
router.patch('/:id/status-lock', requireRoles(['admin']), validate(toggleUserStatusSchema), UserController.toggleUserStatus);
router.post('/staff', requireRoles(['admin']), validate(createStaffSchema), UserController.createStaff);
export default router;
//# sourceMappingURL=user.routes.js.map