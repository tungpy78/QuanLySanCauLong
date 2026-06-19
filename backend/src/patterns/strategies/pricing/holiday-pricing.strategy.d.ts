import type { IPriceStrategy } from './pricing.strategy.js';
export declare class HolidayPricingStrategy implements IPriceStrategy {
    private standardStrategy;
    private surchargePercent;
    constructor(surchargePercent: number);
    calculate(configs: any[], startDateTime: Date, endDateTime: Date): {
        totalPrice: number;
        totalCalculatedMinutes: number;
    };
}
//# sourceMappingURL=holiday-pricing.strategy.d.ts.map