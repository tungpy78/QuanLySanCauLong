import type { IPriceStrategy } from "./pricing.strategy.js";
export declare class VipPricingStrategy implements IPriceStrategy {
    private standardStrategy;
    calculate(configs: any[], startDateTime: Date, endDateTime: Date): {
        totalPrice: number;
        totalCalculatedMinutes: number;
    };
}
//# sourceMappingURL=vip-pricing.strategy.d.ts.map