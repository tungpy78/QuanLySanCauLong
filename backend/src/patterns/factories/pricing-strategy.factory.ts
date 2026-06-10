import type Holiday from "../../models/holiday.model.js";
import { HolidayPricingStrategy } from "../strategies/pricing/holiday-pricing.strategy.js";
import type { IPriceStrategy } from "../strategies/pricing/pricing.strategy.js";
import { StandardPricingStrategy } from "../strategies/pricing/standard-pricing.strategy.js";
import { StudentPricingStrategy } from "../strategies/pricing/student-pricing.strategy.js";
import { VipPricingStrategy } from "../strategies/pricing/vip-pricing.strategy.js";
import { WeekendPricingStrategy } from "../strategies/pricing/weekend-pricing.strategy.js";

export class PricingStrategyFactory {
    static createStrategy(
        holiday: Holiday, 
        userMembership: string,
        isWeekend: boolean,
        studentDiscount: number,
        weekendSurcharge: number
    ): IPriceStrategy {
        if (holiday) return new HolidayPricingStrategy(holiday.surcharge_percent);
        if (userMembership === 'vip') return new VipPricingStrategy();
        if (isWeekend) return new WeekendPricingStrategy(weekendSurcharge);
        if(userMembership === 'student') return new StudentPricingStrategy(studentDiscount);

        return new StandardPricingStrategy();
    }
}