import type { IPriceStrategy } from "./pricing.strategy.js";
export declare class PricingContext {
    private strategy;
    constructor(strategy: IPriceStrategy);
    setStrategy(strategy: IPriceStrategy): void;
    executeCalculation(configs: any[], startDateTime: Date, endDateTime: Date): {
        totalPrice: number;
        totalCalculatedMinutes: number;
    };
}
//# sourceMappingURL=pricing.context.d.ts.map