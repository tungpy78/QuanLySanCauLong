import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
// 3. Khởi tạo Class Model
class User extends Model {
}
// 4. Ánh xạ vào Database
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('admin', 'staff', 'customer'),
        defaultValue: 'customer',
    },
    membership_type: {
        type: DataTypes.ENUM('standard', 'student', 'vip'),
        defaultValue: 'standard',
    },
    loyalty_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    tableName: 'users',
    timestamps: true, // Tự động quản lý created_at, updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Kích hoạt Soft Delete mà thầy trò mình đã chốt (thêm cột deleted_at)
    deletedAt: 'deleted_at',
});
export default User;
//# sourceMappingURL=user.model.js.map