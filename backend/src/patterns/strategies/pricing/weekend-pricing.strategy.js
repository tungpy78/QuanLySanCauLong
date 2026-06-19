import { StandardPricingStrategy } from './standard-pricing.strategy.js';
export class WeekendPricingStrategy {
    standardStrategy = new StandardPricingStrategy();
    surchargePercent;
    constructor(discountPercent) {
        this.surchargePercent = discountPercent;
    }
    calculate(configs, startDateTime, endDateTime) {
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);
        const surchargeMultiplier = 1 + (this.surchargePercent / 100);
        result.totalPrice = result.totalPrice * surchargeMultiplier;
        return result;
    }
}
//# sourceMappingURL=weekend-pricing.strategy.js.map