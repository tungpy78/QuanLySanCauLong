import dayjs from 'dayjs';
import ApiError from '../utils/ErrorClass.js';
import models from '../models/index.js';
import { Op } from 'sequelize';
import { priceConfigRepository } from '../repositories/priceConfig.repository.js';
import { StandardPricingStrategy } from '../patterns/strategies/pricing/standard-pricing.strategy.js';
import { VipPricingStrategy } from '../patterns/strategies/pricing/vip-pricing.strategy.js';
import { PricingContext } from '../patterns/strategies/pricing/pricing.context.js';
import { WeekendPricingStrategy } from '../patterns/strategies/pricing/weekend-pricing.strategy.js';

export class PricingService {
    static async calculateTotalPrice(facilityId: number, courtType: string, startDateTime: Date, endDateTime: Date, isVip: boolean = false) {
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

        let strategy = new StandardPricingStrategy();

        const dayOfWeek = dayjs(startDateTime).day();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        if(isVip) {
            strategy = new VipPricingStrategy();
        }else if (isWeekend) {
            // Ưu tiên 2: Khách thường nhưng đá cuối tuần (Phụ thu 20k/h)
            strategy = new WeekendPricingStrategy();
        }

        const pricingContext = new PricingContext(strategy);
        const {totalPrice, totalCalculatedMinutes} = pricingContext.executeCalculation(configs, startDateTime, endDateTime);

        if (totalCalculatedMinutes < diffInMinutes) {
            throw new ApiError('Khung giờ bạn đặt chứa khoảng thời gian chưa được thiết lập giá (Lỗi hệ thống). Vui lòng đổi giờ khác.', 400);
        }

        return Math.ceil(totalPrice);
    }

    
}