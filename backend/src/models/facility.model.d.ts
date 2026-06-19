import { Model, type Optional } from 'sequelize';
export interface FacilityAttributes {
    id: number;
    name: string;
    address: string;
    timezone: string;
    open_time: string;
    close_time: string;
    avatar_url: string | null;
    cancel_policy: any | null;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface FacilityCreationAttributes extends Optional<FacilityAttributes, 'id' | 'is_active' | 'avatar_url' | 'cancel_policy' | 'timezone' | 'open_time' | 'close_time'> {
}
declare class Facility extends Model<FacilityAttributes, FacilityCreationAttributes> implements FacilityAttributes {
    id: number;
    name: string;
    address: string;
    timezone: string;
    open_time: string;
    close_time: string;
    avatar_url: string | null;
    cancel_policy: any | null;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default Facility;
//# sourceMappingURL=facility.model.d.ts.map