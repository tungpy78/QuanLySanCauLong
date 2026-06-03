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


const rootRouter = Router();

rootRouter.use('/admin/auth', adminAuthRouter);
rootRouter.use('/admin/facilities', adminFacilityRouter);
rootRouter.use('/admin/courts', adminCourtRouter);
rootRouter.use('/admin/bookings', adminBookingRouter);
rootRouter.use('/admin/price-configs', priceConfigRouter);
rootRouter.use('/admin/users', adminUserRouter);
rootRouter.use('/admin/payments', paymentRouter)
rootRouter.use('/upload', uploadRouter);

export default rootRouter;