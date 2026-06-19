import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class Payment extends Model {
}
Payment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    provider: {
        type: DataTypes.ENUM('cash', 'vnpay'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
    },
    amount_cents: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    provider_ref: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
export default Payment;
//# sourceMappingURL=payment.model.js.map