import { Model, type Optional } from 'sequelize';
export interface BookingAttributes {
    id: number;
    user_id: number | null;
    facility_id: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
    payment_method: 'cash' | 'vnpay';
    total_cents: number;
    note: string | null;
    checked_in_at: Date | null;
    cancelled_at: Date | null;
    cancel_reason: string | null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'status' | 'payment_status' | 'payment_method' | 'total_cents' | 'note' | 'checked_in_at' | 'cancelled_at' | 'cancel_reason'> {
}
declare class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    id: number;
    user_id: number | null;
    facility_id: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
    payment_method: 'cash' | 'vnpay';
    total_cents: number;
    note: string | null;
    checked_in_at: Date | null;
    cancelled_at: Date | null;
    cancel_reason: string | null;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default Booking;
//# sourceMappingURL=booking.model.d.ts.map