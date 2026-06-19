import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class OrderItem extends Model {
}
OrderItem.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    variant_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unit_price_cents: { type: DataTypes.INTEGER, allowNull: false },
    discount_cents: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    sequelize,
    tableName: 'order_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
export default OrderItem;
//# sourceMappingURL=order_item.model.js.map