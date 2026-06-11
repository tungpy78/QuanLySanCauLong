import { Router } from "express";

// --- ADMIN IMPORTS ---
import adminAuthRouter from "./admin/auth.routes.js";
import adminFacilityRouter from "./admin/facility.route.js";
import adminCourtRouter from "./admin/court.route.js";
import adminBookingRouter from './admin/booking.route.js';
import priceConfigRouter from './admin/price_config.route.js';
import adminUserRouter from './admin/user.routes.js'
import uploadRouter from './upload.routes.js'
import paymentRouter from './admin/payment.route.js'
import systemConfigRouter from './admin/systemConfig.route.js'
import holidayRouter from './admin/holiday.route.js'
import productRouter from './admin/product.route.js';
import inventoryRouter from './admin/inventory.route.js';
import orderRouter from './admin/order.route.js';

const rootRouter = Router();

rootRouter.use('/admin/auth', adminAuthRouter);
rootRouter.use('/admin/facilities', adminFacilityRouter);
rootRouter.use('/admin/courts', adminCourtRouter);
rootRouter.use('/admin/bookings', adminBookingRouter);
rootRouter.use('/admin/price-configs', priceConfigRouter);
rootRouter.use('/admin/users', adminUserRouter);
rootRouter.use('/admin/payments', paymentRouter)
rootRouter.use('/upload', uploadRouter);
rootRouter.use('/admin/system-configs', systemConfigRouter);
rootRouter.use('/admin/holidays', holidayRouter);
rootRouter.use('/admin/products', productRouter);
rootRouter.use('/admin/inventory', inventoryRouter);
rootRouter.use('/admin/orders', orderRouter);

export default rootRouter;