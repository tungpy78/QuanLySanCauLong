import type { IPriceStrategy } from "./pricing.strategy.js";
export declare class StandardPricingStrategy implements IPriceStrategy {
    calculate(configs: any[], startDateTime: Date, endDateTime: Date): {
        totalPrice: number;
        totalCalculatedMinutes: number;
    };
}
//# sourceMappingURL=standard-pricing.strategy.d.ts.map