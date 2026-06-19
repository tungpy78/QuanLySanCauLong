import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class AuditLog extends Model {
}
AuditLog.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actor_user_id: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity_type: { type: DataTypes.STRING(50), allowNull: false },
    entity_id: { type: DataTypes.INTEGER, allowNull: false },
    payload: { type: DataTypes.JSON, allowNull: true },
    ip_address: { type: DataTypes.STRING(45), allowNull: true }
}, {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});
export default AuditLog;
//# sourceMappingURL=audit_log.model.js.map