import { BookingService } from "../../services/booking.service.js";
import AppResponse from "../../utils/AppResponse.js";
import { UserService } from "../../services/user.service.js";
export class AdminBookingController {
    static async getAll(req, res, next) {
        try {
            const facilityId = req.query.facility_id ? Number(req.query.facility_id) : undefined;
            const result = await BookingService.getAllBookings(facilityId);
            return AppResponse.success(res, result, 'Lấy danh sách lịch đặt thành công', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const bookingId = req.params.booking_id;
            const result = await BookingService.getByBookingId(Number(bookingId));
            return AppResponse.success(res, result, "Lấy chi tiết thông tin Booking thành công!", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getDailyBooked(req, res, next) {
        try {
            const facilityId = Number(req.query.facility_id);
            const date = req.query.date;
            const courtType = req.query.court_type;
            const result = await BookingService.getDailyBookedSlots(facilityId, date, courtType);
            return AppResponse.success(res, result, 'Lấy danh sách giờ đã đặt thành công');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const id = Number(req.params.id);
            const body = req.body;
            const result = await BookingService.updateBookingStatus(id, body);
            return AppResponse.success(res, result, 'Cập nhật trạng thái thành công', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async createByHotline(req, res, next) {
        try {
            const body = req.body;
            const result = await BookingService.createBookingByHotline(body);
            return AppResponse.success(res, result.booking, result.message, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async getVNPayUrl(req, res, next) {
        try {
            const bookingId = Number(req.params.booking_id);
            const ipAddr = req.ip || req.connection.remoteAddress || '127.0.0.1';
            const result = await BookingService.generateVNPayUrl(bookingId, ipAddr);
            return AppResponse.success(res, result, "Tạo link VNPay thành công!", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=booking.controller.js.map