import { z } from "zod";
export declare const createHolidaySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        holiday_date: z.ZodString;
        surcharge_percent: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateHolidayInput = z.infer<typeof createHolidaySchema>["body"];
export declare const updateHolidaySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        holiday_date: z.ZodOptional<z.ZodString>;
        surcharge_percent: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateHolidayInput = z.infer<typeof updateHolidaySchema>["body"];
//# sourceMappingURL=holiday.validation.d.ts.map