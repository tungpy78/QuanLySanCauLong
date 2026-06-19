import { z } from 'zod';
export declare const createPriceConfigSchema: z.ZodObject<{
    body: z.ZodObject<{
        facility_id: z.ZodNumber;
        court_type: z.ZodEnum<{
            badminton: "badminton";
            tennis: "tennis";
            football: "football";
            table_tennis: "table_tennis";
        }>;
        start_time: z.ZodString;
        end_time: z.ZodString;
        price_per_hour: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreatePriceConfigInput = z.infer<typeof createPriceConfigSchema>['body'];
export declare const updatePriceConfigSchema: z.ZodObject<{
    body: z.ZodObject<{
        facility_id: z.ZodOptional<z.ZodNumber>;
        court_type: z.ZodOptional<z.ZodEnum<{
            badminton: "badminton";
            tennis: "tennis";
            football: "football";
            table_tennis: "table_tennis";
        }>>;
        start_time: z.ZodOptional<z.ZodString>;
        end_time: z.ZodOptional<z.ZodString>;
        price_per_hour: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdatePriceConfigInput = z.infer<typeof updatePriceConfigSchema>['body'];
//# sourceMappingURL=priceConfig.validation.d.ts.map