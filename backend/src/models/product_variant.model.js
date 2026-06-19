import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class ProductVariant extends Model {
}
ProductVariant.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    sku: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    attributes: { type: DataTypes.JSON, allowNull: true },
    price_cents: { type: DataTypes.INTEGER, allowNull: false },
    barcode: { type: DataTypes.STRING(50), allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    sequelize,
    tableName: 'product_variants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
});
export default ProductVariant;
//# sourceMappingURL=product_variant.model.js.map