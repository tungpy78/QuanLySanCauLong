import { StandardPricingStrategy } from "./standard-pricing.strategy.js";
export class VipPricingStrategy {
    standardStrategy = new StandardPricingStrategy();
    calculate(configs, startDateTime, endDateTime) {
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);
        result.totalPrice = result.totalPrice * 0.9;
        return result;
    }
}
//# sourceMappingURL=vip-pricing.strategy.js.map