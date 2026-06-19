import dayjs from "dayjs";
export class StandardPricingStrategy {
    calculate(configs, startDateTime, endDateTime) {
        const bStartMins = dayjs(startDateTime).hour() * 60 + dayjs(startDateTime).minute();
        const bEndMins = dayjs(endDateTime).hour() * 60 + dayjs(endDateTime).minute();
        let totalPrice = 0;
        let totalCalculatedMinutes = 0;
        for (const config of configs) {
            const [cStartHour = 0, cStartMin = 0] = config.start_time.split(':').map(Number);
            const [cEndHour = 0, cEndMin = 0] = config.end_time.split(':').map(Number);
            const cStartMins = cStartHour * 60 + cStartMin;
            const cEndMins = cEndHour * 60 + cEndMin;
            const overlapStart = Math.max(bStartMins, cStartMins);
            const overlapEnd = Math.min(bEndMins, cEndMins);
            if (overlapStart < overlapEnd) {
                const overlapMinutes = overlapEnd - overlapStart;
                const overlapHours = overlapMinutes / 60;
                totalPrice += overlapHours * config.price_per_hour;
                totalCalculatedMinutes += overlapMinutes;
            }
        }
        return { totalPrice, totalCalculatedMinutes };
    }
}
//# sourceMappingURL=standard-pricing.strategy.js.map