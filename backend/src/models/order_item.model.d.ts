import { Model, type Optional } from 'sequelize';
export interface OrderItemAttributes {
    id: number;
    order_id: number;
    variant_id: number;
    quantity: number;
    unit_price_cents: number;
    discount_cents: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'discount_cents'> {
}
declare class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    id: number;
    order_id: number;
    variant_id: number;
    quantity: number;
    unit_price_cents: number;
    discount_cents: number;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default OrderItem;
//# sourceMappingURL=order_item.model.d.ts.map