import { z } from "zod";
export declare const createSystemConfigSchema: z.ZodObject<{
    body: z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        data_type: z.ZodEnum<{
            string: "string";
            number: "number";
            boolean: "boolean";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateSystemConfigInput = z.infer<typeof createSystemConfigSchema>["body"];
export declare const updateSystemConfigSchema: z.ZodObject<{
    body: z.ZodObject<{
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateSystemConfigInput = z.infer<typeof updateSystemConfigSchema>["body"];
//# sourceMappingURL=systemConfig.validation.d.ts.map