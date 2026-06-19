import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class Booking extends Model {
}
Booking.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    facility_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
        defaultValue: 'pending',
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'),
        defaultValue: 'unpaid',
    },
    // 🔥 THÊM MỚI VÀO INIT
    payment_method: {
        type: DataTypes.ENUM('cash', 'vnpay'),
        defaultValue: 'cash', // Mặc định vãng lai/hotline là tiền mặt
    },
    total_cents: { type: DataTypes.INTEGER, defaultValue: 0 },
    note: { type: DataTypes.TEXT, allowNull: true },
    checked_in_at: { type: DataTypes.DATE, allowNull: true },
    cancelled_at: { type: DataTypes.DATE, allowNull: true },
    cancel_reason: { type: DataTypes.STRING(255), allowNull: true },
}, {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
});
export default Booking;
//# sourceMappingURL=booking.model.js.map