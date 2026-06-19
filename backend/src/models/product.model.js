import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class Product extends Model {
}
Product.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    category: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    thumbnail_url: { type: DataTypes.STRING(255), allowNull: true },
    rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
    review_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    sequelize,
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
});
export default Product;
//# sourceMappingURL=product.model.js.map