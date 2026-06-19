import { Model, type Optional } from 'sequelize';
export interface InventoryMovementAttributes {
    id: number;
    variant_id: number;
    qty_delta: number;
    reason: 'sale' | 'return' | 'adjustment' | 'import';
    ref_order_id: number | null;
    note: string | null;
    created_at?: Date;
}
export interface InventoryMovementCreationAttributes extends Optional<InventoryMovementAttributes, 'id' | 'ref_order_id' | 'note'> {
}
declare class InventoryMovement extends Model<InventoryMovementAttributes, InventoryMovementCreationAttributes> implements InventoryMovementAttributes {
    id: number;
    variant_id: number;
    qty_delta: number;
    reason: 'sale' | 'return' | 'adjustment' | 'import';
    ref_order_id: number | null;
    note: string | null;
    readonly created_at: Date;
}
export default InventoryMovement;
//# sourceMappingURL=inventory_movement.model.d.ts.map