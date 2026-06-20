import type { IPriceStrategy } from './pricing.strategy.js';
import { StandardPricingStrategy } from './standard-pricing.strategy.js';

export class WeekendPricingStrategy implements IPriceStrategy {
    private standardStrategy = new StandardPricingStrategy();
    private surchargePercent: number;

    constructor(surchargePercent: number) {
        this.surchargePercent = surchargePercent;
    }

    calculate(configs: any[], startDateTime: Date, endDateTime: Date) {
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);
        
       const surchargeMultiplier = 1 + (this.surchargePercent / 100);
        result.totalPrice = result.totalPrice * surchargeMultiplier;
        return result;
    }
}