import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class BookingSlot extends Model {
}
BookingSlot.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    booking_id: { type: DataTypes.INTEGER, allowNull: false },
    court_id: { type: DataTypes.INTEGER, allowNull: false },
    start_at: { type: DataTypes.DATE, allowNull: false },
    end_at: { type: DataTypes.DATE, allowNull: false },
    price_cents: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    tableName: 'booking_slots',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // Không cần paranoid cho bảng trung gian chi tiết này
});
export default BookingSlot;
//# sourceMappingURL=booking_slot.model.js.map