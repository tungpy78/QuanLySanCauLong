import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class CourtType extends Model {
}
CourtType.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.ENUM('badminton', 'tennis', 'table_tennis'),
        allowNull: false,
    },
    surface: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    is_indoor: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'court_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});
export default CourtType;
//# sourceMappingURL=court_type.model.js.map