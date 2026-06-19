import { z } from "zod";
export const createSystemConfigSchema = z.object({
    body: z.object({
        key: z
            .string()
            .min(1, "Key là bắt buộc")
            .regex(/^[A-Z0-9_]+$/, "Key chỉ được chứa chữ in hoa, số và dấu gạch dưới (VD: STUDENT_DISCOUNT)"),
        value: z
            .string()
            .min(1, "Giá trị là bắt buộc"),
        description: z.string().optional(),
        data_type: z.enum(["number", "string", "boolean"], {
            message: "Kiểu dữ liệu phải là number, string hoặc boolean",
        }),
    }),
});
export const updateSystemConfigSchema = z.object({
    body: z.object({
        value: z
            .string()
            .min(1, "Giá trị là bắt buộc"),
        description: z.string().optional(),
        // Key và data_type thường không cho phép sửa
    }),
});
//# sourceMappingURL=systemConfig.validation.js.map