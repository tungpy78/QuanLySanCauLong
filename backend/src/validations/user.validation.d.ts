import { z } from 'zod';
export declare const createStaffSchema: z.ZodObject<{
    body: z.ZodObject<{
        full_name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        password: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<{
            admin: "admin";
            staff: "staff";
            customer: "customer";
        }>>;
        facility_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        job_title: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>['body'];
export declare const toggleUserStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
}, z.core.$strip>;
export interface CreateGuestUserDto {
    phone: string;
    full_name: string;
}
export interface CreateStaffDto {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
    facility_id?: number;
    job_title?: string;
}
export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>['params'];
//# sourceMappingURL=user.validation.d.ts.map