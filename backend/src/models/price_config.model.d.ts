import { Model, type Optional } from 'sequelize';
export interface PriceConfigAttributes {
    id: number;
    facility_id: number;
    court_type: 'badminton' | 'tennis' | 'football' | 'table_tennis';
    start_time: string;
    end_time: string;
    price_per_hour: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface PriceConfigCreationAttributes extends Optional<PriceConfigAttributes, 'id'> {
}
declare class PriceConfig extends Model<PriceConfigAttributes, PriceConfigCreationAttributes> implements PriceConfigAttributes {
    id: number;
    facility_id: number;
    court_type: 'badminton' | 'tennis' | 'football' | 'table_tennis';
    start_time: string;
    end_time: string;
    price_per_hour: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default PriceConfig;
//# sourceMappingURL=price_config.model.d.ts.map