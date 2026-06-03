import type { IPriceStrategy } from './pricing.strategy.js';
import { StandardPricingStrategy } from './standard-pricing.strategy.js';

export class WeekendPricingStrategy implements IPriceStrategy {
    // Gọi thằng Standard ra để làm "đệ tử" tính giá gốc
    private standardStrategy = new StandardPricingStrategy();

    calculate(configs: any[], startDateTime: Date, endDateTime: Date) {
        // 1. Lấy kết quả giá tiêu chuẩn (Chưa phụ thu)
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);
        
        // 2. Tính tiền phụ thu: 20.000đ / giờ
        // (Lấy tổng số phút đã tính đổi ra giờ, nhân với 20.000đ)
        const hours = result.totalCalculatedMinutes / 60;
        const surcharge = hours * 20000; 

        // 3. Cộng tiền phụ thu vào tổng tiền
        result.totalPrice += surcharge;

        // 4. Trả về kết quả cuối cùng
        return result;
    }
}