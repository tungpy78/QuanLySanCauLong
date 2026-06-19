import { Model, DataTypes, } from 'sequelize';
import sequelize from '../config/database.js';
class Court extends Model {
}
Court.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    court_type: {
        type: DataTypes.ENUM('badminton', 'tennis', 'football', 'table_tennis'),
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    tableName: 'courts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
});
export default Court;
//# sourceMappingURL=court.model.js.map