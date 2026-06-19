import { z } from 'zod';
export declare const checkAvailabilitySchema: z.ZodObject<{
    query: z.ZodObject<{
        date: z.ZodString;
        start_time: z.ZodString;
        end_time: z.ZodString;
        court_type: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CheckAvailabilityQuery = z.infer<typeof checkAvailabilitySchema>['query'];
export declare const getDailyBookedSchema: z.ZodObject<{
    query: z.ZodObject<{
        facility_id: z.ZodCoercedNumber<unknown>;
        court_type: z.ZodString;
        date: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const previewPriceSchema: z.ZodObject<{
    body: z.ZodObject<{
        facility_id: z.ZodNumber;
        court_type: z.ZodEnum<{
            standard: "standard";
            vip: "vip";
        }>;
        date: z.ZodString;
        start_time: z.ZodString;
        end_time: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PreviewPriceInput = z.infer<typeof previewPriceSchema>['body'];
export declare const createBookingSchema: z.ZodObject<{
    body: z.ZodObject<{
        facility_id: z.ZodNumber;
        court_id: z.ZodNumber;
        date: z.ZodString;
        start_time: z.ZodString;
        end_time: z.ZodString;
        payment_method: z.ZodDefault<z.ZodEnum<{
            cash: "cash";
            vnpay: "vnpay";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export declare const createBookingByHotlineSchema: z.ZodObject<{
    body: z.ZodObject<{
        customer_phone: z.ZodString;
        customer_name: z.ZodOptional<z.ZodString>;
        membership_type: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            standard: "standard";
            student: "student";
            vip: "vip";
        }>>>;
        facility_id: z.ZodNumber;
        court_id: z.ZodNumber;
        date: z.ZodString;
        start_time: z.ZodString;
        end_time: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateBookingByHotlineInput = z.infer<typeof createBookingByHotlineSchema>['body'];
export declare const updateBookingStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            confirmed: "confirmed";
            cancelled: "cancelled";
            completed: "completed";
            no_show: "no_show";
        }>>;
        payment_status: z.ZodOptional<z.ZodEnum<{
            unpaid: "unpaid";
            partial: "partial";
            paid: "paid";
            refunded: "refunded";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>['body'];
//# sourceMappingURL=booking.validation.d.ts.map