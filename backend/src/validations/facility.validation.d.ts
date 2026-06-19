import { z } from 'zod';
export declare const createFacilitySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        address: z.ZodString;
        open_time: z.ZodDefault<z.ZodString>;
        close_time: z.ZodDefault<z.ZodString>;
        timezone: z.ZodDefault<z.ZodString>;
        avatar_url: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
        cancel_policy: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodAny>>>;
        is_active: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateFacilityInput = z.infer<typeof createFacilitySchema>['body'];
export declare const updateFacilitySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        open_time: z.ZodOptional<z.ZodString>;
        close_time: z.ZodOptional<z.ZodString>;
        timezone: z.ZodOptional<z.ZodString>;
        avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        cancel_policy: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
        is_active: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type updateFacilityInput = z.infer<typeof updateFacilitySchema>['body'];
//# sourceMappingURL=facility.validation.d.ts.map