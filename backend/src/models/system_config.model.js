import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
// 3. Khởi tạo Class Model
class SystemConfig extends Model {
}
// 4. Ánh xạ vào Database
SystemConfig.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // BẮT BUỘC: Đảm bảo không có 2 cấu hình trùng Key
    },
    value: {
        type: DataTypes.STRING(255),
        allowNull: false, // Dù là số hay boolean thì lưu vào DB vẫn là chuỗi (string)
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Mô tả để Admin dễ hiểu
    },
    data_type: {
        type: DataTypes.ENUM('number', 'string', 'boolean'),
        allowNull: false,
        defaultValue: 'string', // Giúp code lúc lôi ra biết đường ép kiểu
    },
}, {
    sequelize,
    tableName: 'system_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Bật khiên xóa mềm cho an toàn
    deletedAt: 'deleted_at',
});
export default SystemConfig;
//# sourceMappingURL=system_config.model.js.map