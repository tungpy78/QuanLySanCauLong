import { Model, type Optional } from 'sequelize';
export interface AuditLogAttributes {
    id: number;
    actor_user_id: number | null;
    action: string;
    entity_type: string;
    entity_id: number;
    payload: any | null;
    ip_address: string | null;
    created_at?: Date;
}
export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'actor_user_id' | 'payload' | 'ip_address'> {
}
declare class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
    id: number;
    actor_user_id: number | null;
    action: string;
    entity_type: string;
    entity_id: number;
    payload: any | null;
    ip_address: string | null;
    readonly created_at: Date;
}
export default AuditLog;
//# sourceMappingURL=audit_log.model.d.ts.map