import { Model, type Optional } from 'sequelize';
export interface PaymentAttributes {
    id: number;
    provider: 'cash' | 'vnpay';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    amount_cents: number;
    booking_id: number | null;
    order_id: number | null;
    provider_ref: string | null;
    metadata: any | null;
    paid_at: Date | null;
    created_at?: Date;
    updated_at?: Date;
}
export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'status' | 'booking_id' | 'order_id' | 'provider_ref' | 'metadata' | 'paid_at'> {
}
declare class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    id: number;
    provider: 'cash' | 'vnpay';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    amount_cents: number;
    booking_id: number | null;
    order_id: number | null;
    provider_ref: string | null;
    metadata: any | null;
    paid_at: Date | null;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default Payment;
//# sourceMappingURL=payment.model.d.ts.map