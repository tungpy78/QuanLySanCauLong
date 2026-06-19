import { Router } from "express";
import { HolidayController } from "../../controllers/admin/holiday.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createHolidaySchema, updateHolidaySchema } from "../../validations/holiday.validation.js";
const router = Router();
router.use(verifyToken, requireRoles(['admin']));
router.get('/', HolidayController.getAllHolidays);
router.post('/', validate(createHolidaySchema), HolidayController.createHoliday);
router.put('/:id', validate(updateHolidaySchema), HolidayController.updateHoliday);
router.delete('/:id', HolidayController.deleteHoliday);
export default router;
//# sourceMappingURL=holiday.route.js.map