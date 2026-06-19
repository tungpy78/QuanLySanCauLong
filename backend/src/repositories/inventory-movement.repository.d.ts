declare class InventoryMovementRepository {
    createMovement(data: any, transaction?: any): Promise<import("../models/inventory_movement.model.js").default>;
    getMovements(where: any, limit: number, offset: number): Promise<{
        rows: import("../models/inventory_movement.model.js").default[];
        count: number;
    }>;
}
export declare const inventoryMovementRepository: InventoryMovementRepository;
export {};
//# sourceMappingURL=inventory-movement.repository.d.ts.map