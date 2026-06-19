import { z } from 'zod';
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
// Schema chung cho /summary và /breakdown
export const getRevenueCommonSchema = z.object({
    query: z.object({
        from: z.string()
            .regex(dateRegex, 'Ngày bắt đầu phải đúng định dạng YYYY-MM-DD (VD: 2026-06-01)')
            .optional(),
        to: z.string()
            .regex(dateRegex, 'Ngày kết thúc phải đúng định dạng YYYY-MM-DD (VD: 2026-06-30)')
            .optional(),
        facility_id: z.coerce.number()
            .int('ID cơ sở phải là số nguyên')
            .positive('ID cơ sở phải lớn hơn 0')
            .optional()
    })
});
// Schema riêng cho /chart
export const getRevenueChartSchema = z.object({
    query: z.object({
        from: z.string()
            .regex(dateRegex, 'Ngày bắt đầu phải đúng định dạng YYYY-MM-DD (VD: 2026-06-01)')
            .optional(),
        to: z.string()
            .regex(dateRegex, 'Ngày kết thúc phải đúng định dạng YYYY-MM-DD (VD: 2026-06-30)')
            .optional(),
        facility_id: z.coerce.number()
            .int('ID cơ sở phải là số nguyên')
            .positive('ID cơ sở phải lớn hơn 0')
            .optional(),
        group_by: z.enum(['day', 'month']).default('day')
    })
});
// Schema riêng cho /transactions
export const getRevenueTransactionsSchema = z.object({
    query: z.object({
        from: z.string()
            .regex(dateRegex, 'Ngày bắt đầu phải đúng định dạng YYYY-MM-DD (VD: 2026-06-01)')
            .optional(),
        to: z.string()
            .regex(dateRegex, 'Ngày kết thúc phải đúng định dạng YYYY-MM-DD (VD: 2026-06-30)')
            .optional(),
        facility_id: z.coerce.number()
            .int('ID cơ sở phải là số nguyên')
            .positive('ID cơ sở phải lớn hơn 0')
            .optional(),
        source: z.enum(['booking', 'order', 'all']).default('all'),
        provider: z.enum(['cash', 'vnpay', 'all']).default('all'),
        page: z.coerce.number()
            .int('Trang phải là số nguyên')
            .min(1, 'Trang phải lớn hơn hoặc bằng 1')
            .default(1),
        limit: z.coerce.number()
            .int('Số bản ghi phải là số nguyên')
            .min(1, 'Số bản ghi phải lớn hơn hoặc bằng 1')
            .max(100, 'Số bản ghi tối đa là 100')
            .default(20),
        sortBy: z.enum(['paidAt', 'amount']).default('paidAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc')
    })
});
//# sourceMappingURL=revenue.validation.js.map