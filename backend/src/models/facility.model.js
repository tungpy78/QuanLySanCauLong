import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class Facility extends Model {
}
Facility.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    timezone: { type: DataTypes.STRING(50), defaultValue: 'Asia/Ho_Chi_Minh' },
    open_time: { type: DataTypes.TIME, defaultValue: '06:00:00' },
    close_time: { type: DataTypes.TIME, defaultValue: '22:00:00' },
    avatar_url: { type: DataTypes.TEXT, allowNull: true },
    cancel_policy: { type: DataTypes.JSON, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    sequelize,
    tableName: 'facilities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
});
export default Facility;
//# sourceMappingURL=facility.model.js.map