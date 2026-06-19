import z from "zod";
export declare const createCourtSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        facility_id: z.ZodNumber;
        court_type: z.ZodEnum<{
            badminton: "badminton";
            tennis: "tennis";
            football: "football";
            table_tennis: "table_tennis";
        }>;
        is_active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export type CreateCourtInput = z.infer<typeof createCourtSchema>['body'];
export declare const updateCourtSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        facility_id: z.ZodOptional<z.ZodNumber>;
        court_type: z.ZodOptional<z.ZodEnum<{
            badminton: "badminton";
            tennis: "tennis";
            football: "football";
            table_tennis: "table_tennis";
        }>>;
        is_active: z.ZodOptional<z.ZodBoolean>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export type UpdateCourtInput = z.infer<typeof updateCourtSchema>['body'];
//# sourceMappingURL=court.validation.d.ts.map