import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class PriceConfig extends Model {
}
PriceConfig.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    facility_id: { type: DataTypes.INTEGER, allowNull: false },
    court_type: { type: DataTypes.STRING, allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    price_per_hour: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    tableName: 'price_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
});
export default PriceConfig;
//# sourceMappingURL=price_config.model.js.map