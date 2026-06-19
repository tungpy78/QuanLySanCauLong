import { Model, type Optional } from 'sequelize';
export interface SystemConfigAttributes {
    id: number;
    key: string;
    value: string;
    description: string | null;
    data_type: 'number' | 'string' | 'boolean';
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface SystemConfigCreationAttributes extends Optional<SystemConfigAttributes, 'id'> {
}
declare class SystemConfig extends Model<SystemConfigAttributes, SystemConfigCreationAttributes> implements SystemConfigAttributes {
    id: number;
    key: string;
    value: string;
    description: string | null;
    data_type: 'number' | 'string' | 'boolean';
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default SystemConfig;
//# sourceMappingURL=system_config.model.d.ts.map