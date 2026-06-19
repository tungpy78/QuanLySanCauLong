import { Model, type Optional } from 'sequelize';
export interface InventoryLevelAttributes {
    id: number;
    variant_id: number;
    facility_id: number;
    quantity_on_hand: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface InventoryLevelCreationAttributes extends Optional<InventoryLevelAttributes, 'id' | 'quantity_on_hand'> {
}
declare class InventoryLevel extends Model<InventoryLevelAttributes, InventoryLevelCreationAttributes> implements InventoryLevelAttributes {
    id: number;
    variant_id: number;
    facility_id: number;
    quantity_on_hand: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default InventoryLevel;
//# sourceMappingURL=inventory_level.model.d.ts.map