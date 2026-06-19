import type { IPriceStrategy } from './pricing.strategy.js';
export declare class WeekendPricingStrategy implements IPriceStrategy {
    private standardStrategy;
    private surchargePercent;
    constructor(discountPercent: number);
    calculate(configs: any[], startDateTime: Date, endDateTime: Date): {
        totalPrice: number;
        totalCalculatedMinutes: number;
    };
}
//# sourceMappingURL=weekend-pricing.strategy.d.ts.map