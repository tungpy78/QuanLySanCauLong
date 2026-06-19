import { Model, type Optional } from 'sequelize';
export interface CourtTypeAttributes {
    id: number;
    name: 'badminton' | 'tennis' | 'table_tennis';
    surface: string | null;
    is_indoor: boolean;
    description: string | null;
    created_at?: Date;
}
export interface CourtTypeCreationAttributes extends Optional<CourtTypeAttributes, 'id' | 'is_indoor' | 'surface' | 'description'> {
}
declare class CourtType extends Model<CourtTypeAttributes, CourtTypeCreationAttributes> implements CourtTypeAttributes {
    id: number;
    name: 'badminton' | 'tennis' | 'table_tennis';
    surface: string | null;
    is_indoor: boolean;
    description: string | null;
    readonly created_at: Date;
}
export default CourtType;
//# sourceMappingURL=court_type.model.d.ts.map