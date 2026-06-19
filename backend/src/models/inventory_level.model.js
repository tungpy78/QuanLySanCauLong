import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class InventoryLevel extends Model {
}
InventoryLevel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    variant_id: { type: DataTypes.INTEGER, allowNull: false },
    facility_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity_on_hand: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    sequelize,
    tableName: 'inventory_levels',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // BẬT KHIÊN XÓA MỀM
    deletedAt: 'deleted_at', // Bổ sung
    indexes: [
        { unique: true, fields: ['variant_id', 'facility_id'] },
    ],
});
export default InventoryLevel;
//# sourceMappingURL=inventory_level.model.js.map