import type { CreateBookingByHotlineInput, CreateBookingInput, UpdateBookingStatusInput } from '../validations/booking.validation.js';
import dayjs from 'dayjs';
export declare class BookingService {
    static getAvailableCourts(startDateTime: Date, endDateTime: Date, courtType?: string): Promise<any[]>;
    static getDailyBookedSlots(facilityId: number, date: string, courtType: string): Promise<{
        courts: never[];
        slotsByCourtId: {};
        rawBookedSlots?: never;
    } | {
        courts: any[];
        slotsByCourtId: Record<number, any[]>;
        rawBookedSlots: {
            booking_id: any;
            price_cents: any;
            court_id: any;
            start_time: string;
            end_time: string;
        }[];
    }>;
    static createBooking(userId: number, data: CreateBookingInput): Promise<any>;
    private static checkConflictingSlot;
    private static checkSmartGapRules;
    static getMyBookings(userId: number): Promise<any[]>;
    static getAllBookings(facilityId?: number): Promise<any[]>;
    static getByBookingId(bookingId: number): Promise<any>;
    static updateBookingStatus(id: number, data: UpdateBookingStatusInput): Promise<any>;
    static validateBookingTimes(date: string, startTime: string, endTime: string): Promise<{
        startDateTime: dayjs.Dayjs;
        endDateTime: dayjs.Dayjs;
    }>;
    static createBookingByHotline(data: CreateBookingByHotlineInput): Promise<{
        booking: any;
        user: any;
        message: string;
    }>;
    static generateVNPayUrl(bookingId: number, ipAddr: string): Promise<{
        paymentUrl: string;
    }>;
}
//# sourceMappingURL=booking.service.d.ts.map