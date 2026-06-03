import type { IPriceStrategy } from "./pricing.strategy.js";

export class PricingContext {
    private strategy: IPriceStrategy;

    constructor(strategy: IPriceStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: IPriceStrategy) {
        this.strategy = strategy;
    }

    executeCalculation(configs: any[], startDateTime: Date, endDateTime: Date) {
        return this.strategy.calculate(configs, startDateTime, endDateTime);
    }
}