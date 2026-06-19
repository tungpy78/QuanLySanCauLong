import { z } from 'zod';
export declare const adjustInventorySchema: z.ZodObject<{
    body: z.ZodObject<{
        variant_id: z.ZodNumber;
        facility_id: z.ZodNumber;
        qty_delta: z.ZodNumber;
        reason: z.ZodEnum<{
            sale: "sale";
            return: "return";
            adjustment: "adjustment";
            import: "import";
        }>;
        note: z.ZodOptional<z.ZodString>;
        ref_order_id: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * 2. Validate cho việc Chuyển kho giữa 2 cơ sở
 */
export declare const transferStockSchema: z.ZodObject<{
    body: z.ZodObject<{
        variant_id: z.ZodNumber;
        from_facility_id: z.ZodNumber;
        to_facility_id: z.ZodNumber;
        quantity: z.ZodNumber;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * 3. Validate cho việc Kiểm kê (Đồng bộ số lượng thực tế)
 */
export declare const syncStockSchema: z.ZodObject<{
    body: z.ZodObject<{
        variant_id: z.ZodNumber;
        facility_id: z.ZodNumber;
        actual_quantity: z.ZodNumber;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * 4. Validate query cho việc lấy Lịch sử biến động
 */
export declare const getInventoryLogsSchema: z.ZodObject<{
    query: z.ZodObject<{
        facility_id: z.ZodOptional<z.ZodString>;
        variant_id: z.ZodOptional<z.ZodString>;
        reason: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=inventory.validation.d.ts.map