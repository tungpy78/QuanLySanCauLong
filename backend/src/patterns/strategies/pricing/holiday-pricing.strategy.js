import { StandardPricingStrategy } from './standard-pricing.strategy.js';
export class HolidayPricingStrategy {
    standardStrategy = new StandardPricingStrategy();
    surchargePercent;
    constructor(surchargePercent) {
        this.surchargePercent = surchargePercent;
    }
    calculate(configs, startDateTime, endDateTime) {
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);
        // Phụ thu X% theo cấu hình của Admin
        const surchargeMultiplier = 1 + (this.surchargePercent / 100);
        result.totalPrice = result.totalPrice * surchargeMultiplier;
        return result;
    }
}
//# sourceMappingURL=holiday-pricing.strategy.js.map