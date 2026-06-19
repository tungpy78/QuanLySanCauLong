import { Model, type Optional } from 'sequelize';
export interface OrderAttributes {
    id: number;
    user_id: number | null;
    facility_id: number;
    status: 'pending_payment' | 'pending_pickup' | 'completed' | 'cancelled' | 'refunded' | 'expired';
    total_cents: number;
    note: string | null;
    pickup_type: 'immediate' | 'pickup_store';
    pickup_time: Date | null;
    reservation_expires_at: Date | null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status' | 'user_id' | 'total_cents' | 'note' | 'pickup_type' | 'pickup_time' | 'reservation_expires_at'> {
}
declare class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    id: number;
    user_id: number | null;
    facility_id: number;
    status: 'pending_payment' | 'pending_pickup' | 'completed' | 'cancelled' | 'refunded' | 'expired';
    total_cents: number;
    note: string | null;
    pickup_type: 'immediate' | 'pickup_store';
    pickup_time: Date | null;
    reservation_expires_at: Date | null;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default Order;
//# sourceMappingURL=order.model.d.ts.map