import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class Order extends Model {
}
Order.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    facility_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
        type: DataTypes.ENUM('pending_payment', 'pending_pickup', 'completed', 'cancelled', 'refunded', 'expired'),
        defaultValue: 'pending_payment',
    },
    total_cents: { type: DataTypes.INTEGER, defaultValue: 0 },
    note: { type: DataTypes.TEXT, allowNull: true },
    pickup_type: {
        type: DataTypes.ENUM('immediate', 'pickup_store'),
        defaultValue: 'immediate',
        allowNull: false,
    },
    pickup_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    reservation_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
});
export default Order;
//# sourceMappingURL=order.model.js.map