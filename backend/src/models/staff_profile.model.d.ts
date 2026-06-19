import { Model, type Optional } from 'sequelize';
export interface StaffProfileAttributes {
    id: number;
    user_id: number;
    facility_id: number | null;
    job_title: string | null;
    active: boolean;
    created_at?: Date;
}
export interface StaffProfileCreationAttributes extends Optional<StaffProfileAttributes, 'id' | 'facility_id' | 'job_title' | 'active'> {
}
declare class StaffProfile extends Model<StaffProfileAttributes, StaffProfileCreationAttributes> implements StaffProfileAttributes {
    id: number;
    user_id: number;
    facility_id: number | null;
    job_title: string | null;
    active: boolean;
    readonly created_at: Date;
}
export default StaffProfile;
//# sourceMappingURL=staff_profile.model.d.ts.map