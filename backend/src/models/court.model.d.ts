import { Model, type Optional } from 'sequelize';
export interface CourtAttributes {
    id: number;
    facility_id: number;
    name: string;
    court_type: 'badminton' | 'tennis' | 'football' | 'table_tennis';
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface CourtCreationAttributes extends Optional<CourtAttributes, 'id' | 'is_active'> {
}
declare class Court extends Model<CourtAttributes, CourtCreationAttributes> implements CourtAttributes {
    id: number;
    facility_id: number;
    name: string;
    court_type: 'badminton' | 'tennis' | 'football' | 'table_tennis';
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default Court;
//# sourceMappingURL=court.model.d.ts.map