import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class StaffProfile extends Model {
}
StaffProfile.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    facility_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    job_title: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    tableName: 'staff_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});
export default StaffProfile;
//# sourceMappingURL=staff_profile.model.js.map