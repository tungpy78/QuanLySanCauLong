import { holidayRepository } from '../repositories/holiday.repository.js';
import ApiError from '../utils/ErrorClass.js';

export class HolidayService {
    // 1. Lấy danh sách ngày lễ (Sắp xếp theo ngày tăng dần)
    static async getAllHolidays() {
        return await holidayRepository.findAll({
            order: [['holiday_date', 'ASC']]
        });
    }

    // 2. Thêm ngày lễ mới
    static async createHoliday(data: { name: string; holiday_date: string; surcharge_percent: number }) {
        // Kiểm tra xem ngày này đã có ai cấu hình chưa
        const existingHoliday = await holidayRepository.findOne({
            where: { holiday_date: data.holiday_date }
        });

        if (existingHoliday) {
            throw new ApiError(`Ngày ${data.holiday_date} đã được cấu hình trước đó!`, 400);
        }

        return await holidayRepository.create(data);
    }

    // 3. Sửa ngày lễ (Ví dụ: Đổi từ phụ thu 20% lên 30%)
    static async updateHoliday(id: number, data: any) {
        const holiday = await holidayRepository.findById(id);
        if (!holiday) throw new ApiError('Không tìm thấy cấu hình ngày lễ này', 404);

        // Nếu có update ngày, phải check xem ngày mới có bị trùng không
        if (data.holiday_date && data.holiday_date !== holiday.holiday_date) {
            const existing = await holidayRepository.findOne({ where: { holiday_date: data.holiday_date } });
            if (existing) throw new ApiError('Ngày lễ mới đã bị trùng lặp!', 400);
        }

        return await holidayRepository.update(id, data);
    }

    // 4. Xóa cấu hình ngày lễ
    static async deleteHoliday(id: number) {
        const holiday = await holidayRepository.findById(id);
        if (!holiday) throw new ApiError('Không tìm thấy cấu hình ngày lễ này', 404);
        
        return await holidayRepository.destroy(id);
    }
}