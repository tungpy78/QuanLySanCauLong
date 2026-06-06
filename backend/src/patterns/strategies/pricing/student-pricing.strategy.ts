// src/patterns/strategies/pricing/student-pricing.strategy.ts
import type { IPriceStrategy } from './pricing.strategy.js';
import { StandardPricingStrategy } from './standard-pricing.strategy.js';

export class StudentPricingStrategy implements IPriceStrategy {
    private standardStrategy = new StandardPricingStrategy();
    private discountPercent: number;

    constructor(discountPercent: number) {
        this.discountPercent = discountPercent;
    }

    calculate(configs: any[], startDateTime: Date, endDateTime: Date) {
        const result = this.standardStrategy.calculate(configs, startDateTime, endDateTime);
        
        const discountMultiplier = 1 - (this.discountPercent / 100);
        result.totalPrice = result.totalPrice * discountMultiplier;
        return result;
    }
}