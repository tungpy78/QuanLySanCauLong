import type { IPriceStrategy } from './pricing.strategy.js';
export declare class StudentPricingStrategy implements IPriceStrategy {
    private standardStrategy;
    private discountPercent;
    constructor(discountPercent: number);
    calculate(configs: any[], startDateTime: Date, endDateTime: Date): {
        totalPrice: number;
        totalCalculatedMinutes: number;
    };
}
//# sourceMappingURL=student-pricing.strategy.d.ts.map