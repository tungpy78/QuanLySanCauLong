import type Holiday from "../../models/holiday.model.js";
import type { IPriceStrategy } from "../strategies/pricing/pricing.strategy.js";
export declare class PricingStrategyFactory {
    static createStrategy(holiday: Holiday, userMembership: string, isWeekend: boolean, studentDiscount: number, weekendSurcharge: number): IPriceStrategy;
}
//# sourceMappingURL=pricing-strategy.factory.d.ts.map