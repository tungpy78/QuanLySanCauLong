import dayjs from 'dayjs';
import ApiError from '../utils/ErrorClass.js';
import models from '../models/index.js';
import { Op } from 'sequelize';
import { priceConfigRepository } from '../repositories/priceConfig.repository.js';
import { StandardPricingStrategy } from '../patterns/strategies/pricing/standard-pricing.strategy.js';
import { VipPricingStrategy } from '../patterns/strategies/pricing/vip-pricing.strategy.js';
import { PricingContext } from '../patterns/strategies/pricing/pricing.context.js';
import { WeekendPricingStrategy } from '../patterns/strategies/pricing/weekend-pricing.strategy.js';
import { HolidayPricingStrategy } from '../patterns/strategies/pricing/holiday-pricing.strategy.js';
import { holidayRepository } from '../repositories/holiday.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import type { IPriceStrategy } from '../patterns/strategies/pricing/pricing.strategy.js';
import { StudentPricingStrategy } from '../patterns/strategies/pricing/student-pricing.strategy.js';
import { systemConfigRepository } from '../repositories/systemConfig.repository.js';
import { PricingStrategyFactory } from '../patterns/factories/pricing-strategy.factory.js';

export class PricingService {
    static async calculateTotalPrice(facilityId: number, courtType: string, startDateTime: Date, endDateTime: Date, userId?: number | null) {
        const diffInMinutes = dayjs(endDateTime).diff(dayjs(startDateTime), 'minute');
        if (diffInMinutes <= 0) {
            throw new ApiError('Thời gian đặt sân không hợp lệ', 400);
        }

        const configs = await priceConfigRepository.findAll({
            where: {
                facility_id: facilityId,
                court_type: courtType
            }
        });

        if (!configs || configs.length === 0) {
            throw new ApiError('Không tìm thấy cấu hình giá cho sân này. Vui lòng liên hệ Admin.', 400);
        }

        const bookingDate = dayjs(startDateTime).format('YYYY-MM-DD');
        const holiday = await holidayRepository.findOne({ where: { holiday_date: bookingDate } });
        
        let userMembership = 'standard';
        if (userId) {
            const user = await userRepository.findById(userId);
            if (user) userMembership = user.membership_type; // 'student' hoặc 'vip'
        }

        const dayOfWeek = dayjs(startDateTime).day();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const studentDiscountConfig = await systemConfigRepository.findByKey('STUDENT_DISCOUNT_PERCENT');
        const weekendSurchargeConfig = await systemConfigRepository.findByKey('WEEKEND_SURCHARGE_PERCENT');

        const studentDiscount = studentDiscountConfig ? Number(studentDiscountConfig.value) : 0;
        const weekendSurcharge = weekendSurchargeConfig ? Number(weekendSurchargeConfig.value) : 0;

        const strategy = PricingStrategyFactory.createStrategy(
            holiday, userMembership, isWeekend, studentDiscount, weekendSurcharge
        )

        const pricingContext = new PricingContext(strategy);
        const {totalPrice, totalCalculatedMinutes} = pricingContext.executeCalculation(configs, startDateTime, endDateTime);

        if (totalCalculatedMinutes < diffInMinutes) {
            throw new ApiError('Khung giờ bạn đặt chứa khoảng thời gian chưa được thiết lập giá (Lỗi hệ thống). Vui lòng đổi giờ khác.', 400);
        }

        return Math.ceil(totalPrice);
    }

    
}