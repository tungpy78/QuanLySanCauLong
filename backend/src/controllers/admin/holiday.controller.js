import AppResponse from '../../utils/AppResponse.js';
import { HolidayService } from '../../services/holiday.service.js';
export class HolidayController {
    static async getAllHolidays(req, res, next) {
        try {
            const holidays = await HolidayService.getAllHolidays();
            return AppResponse.success(res, holidays, 'Lấy danh sách ngày lễ thành công');
        }
        catch (error) {
            next(error);
        }
    }
    static async createHoliday(req, res, next) {
        try {
            const newHoliday = await HolidayService.createHoliday(req.body);
            return AppResponse.success(res, newHoliday, 'Tạo cấu hình lễ thành công', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateHoliday(req, res, next) {
        try {
            const result = await HolidayService.updateHoliday(Number(req.params.id), req.body);
            return AppResponse.success(res, result, 'Cập nhật cấu hình lễ thành công');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteHoliday(req, res, next) {
        try {
            const result = await HolidayService.deleteHoliday(Number(req.params.id));
            return AppResponse.success(res, result, 'Xóa cấu hình thành công');
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=holiday.controller.js.map