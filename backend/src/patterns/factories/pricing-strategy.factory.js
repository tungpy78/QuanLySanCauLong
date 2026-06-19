import { HolidayPricingStrategy } from "../strategies/pricing/holiday-pricing.strategy.js";
import { StandardPricingStrategy } from "../strategies/pricing/standard-pricing.strategy.js";
import { StudentPricingStrategy } from "../strategies/pricing/student-pricing.strategy.js";
import { VipPricingStrategy } from "../strategies/pricing/vip-pricing.strategy.js";
import { WeekendPricingStrategy } from "../strategies/pricing/weekend-pricing.strategy.js";
export class PricingStrategyFactory {
    static createStrategy(holiday, userMembership, isWeekend, studentDiscount, weekendSurcharge) {
        if (holiday)
            return new HolidayPricingStrategy(holiday.surcharge_percent);
        if (userMembership === 'vip')
            return new VipPricingStrategy();
        if (isWeekend)
            return new WeekendPricingStrategy(weekendSurcharge);
        if (userMembership === 'student')
            return new StudentPricingStrategy(studentDiscount);
        return new StandardPricingStrategy();
    }
}
//# sourceMappingURL=pricing-strategy.factory.js.map