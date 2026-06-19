import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class InventoryMovement extends Model {
}
InventoryMovement.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    variant_id: { type: DataTypes.INTEGER, allowNull: false },
    qty_delta: { type: DataTypes.INTEGER, allowNull: false },
    reason: {
        type: DataTypes.ENUM('sale', 'return', 'adjustment', 'import'),
        allowNull: false,
    },
    ref_order_id: { type: DataTypes.INTEGER, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
}, {
    sequelize,
    tableName: 'inventory_movements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});
export default InventoryMovement;
//# sourceMappingURL=inventory_movement.model.js.map