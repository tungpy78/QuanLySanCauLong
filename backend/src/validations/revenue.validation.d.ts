import { z } from 'zod';
export declare const getRevenueCommonSchema: z.ZodObject<{
    query: z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        facility_id: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getRevenueChartSchema: z.ZodObject<{
    query: z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        facility_id: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        group_by: z.ZodDefault<z.ZodEnum<{
            day: "day";
            month: "month";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getRevenueTransactionsSchema: z.ZodObject<{
    query: z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        facility_id: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        source: z.ZodDefault<z.ZodEnum<{
            order: "order";
            booking: "booking";
            all: "all";
        }>>;
        provider: z.ZodDefault<z.ZodEnum<{
            cash: "cash";
            vnpay: "vnpay";
            all: "all";
        }>>;
        page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        sortBy: z.ZodDefault<z.ZodEnum<{
            paidAt: "paidAt";
            amount: "amount";
        }>>;
        sortOrder: z.ZodDefault<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type GetRevenueCommonInput = z.infer<typeof getRevenueCommonSchema>;
export type GetRevenueChartInput = z.infer<typeof getRevenueChartSchema>;
export type GetRevenueTransactionsInput = z.infer<typeof getRevenueTransactionsSchema>;
//# sourceMappingURL=revenue.validation.d.ts.map