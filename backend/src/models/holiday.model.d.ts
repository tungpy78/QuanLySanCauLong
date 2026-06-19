import { Model, type Optional } from 'sequelize';
export interface HolidayAttributes {
    id: number;
    name: string;
    holiday_date: string;
    surcharge_percent: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface HolidayCreationAttributes extends Optional<HolidayAttributes, 'id'> {
}
declare class Holiday extends Model<HolidayAttributes, HolidayCreationAttributes> implements HolidayAttributes {
    id: number;
    name: string;
    holiday_date: string;
    surcharge_percent: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default Holiday;
//# sourceMappingURL=holiday.model.d.ts.map