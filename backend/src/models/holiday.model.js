import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
// 3. Khởi tạo Class Model
class Holiday extends Model {
}
// 4. Ánh xạ vào Database
Holiday.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    holiday_date: {
        type: DataTypes.DATEONLY, // Chỉ lưu Ngày-Tháng-Năm, không lưu Giờ-Phút-Giây
        allowNull: false,
        unique: true, // Một ngày chỉ nên cài đặt 1 mức phụ thu lễ để tránh xung đột
    },
    surcharge_percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'holidays',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Thêm khiên xóa mềm cho đồng bộ với các bảng khác
    deletedAt: 'deleted_at',
});
export default Holiday;
//# sourceMappingURL=holiday.model.js.map