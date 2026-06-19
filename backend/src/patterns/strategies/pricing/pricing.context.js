export class PricingContext {
    strategy;
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    executeCalculation(configs, startDateTime, endDateTime) {
        return this.strategy.calculate(configs, startDateTime, endDateTime);
    }
}
//# sourceMappingURL=pricing.context.js.map