import type { IPriceStrategy } from "./pricing.strategy.js";
import { StandardPricingStrategy } from "./standard-pricing.strategy.js";

export class VipPricingStrategy implements IPriceStrategy {
    private standardStrategy = new StandardPricingStrategy();
    calculate(configs: any[], startDateTime: Date, endDateTime: Date) {
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);

        result.totalPrice = result.totalPrice * 0.9;

        return result
    }

}