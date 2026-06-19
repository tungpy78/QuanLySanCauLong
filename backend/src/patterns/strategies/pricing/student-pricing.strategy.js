import { StandardPricingStrategy } from './standard-pricing.strategy.js';
export class StudentPricingStrategy {
    standardStrategy = new StandardPricingStrategy();
    discountPercent;
    constructor(discountPercent) {
        this.discountPercent = discountPercent;
    }
    calculate(configs, startDateTime, endDateTime) {
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);
        const discountMultiplier = 1 - (this.discountPercent / 100);
        result.totalPrice = result.totalPrice * discountMultiplier;
        return result;
    }
}
//# sourceMappingURL=student-pricing.strategy.js.map