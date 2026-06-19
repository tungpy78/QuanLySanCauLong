import { BaseRepository } from './base.repository.js';
declare class InventoryRepository extends BaseRepository<any> {
    constructor();
    findOrCreateInventory(variant_id: number, facility_id: number, transaction?: any): Promise<[any, boolean]>;
    getLevelsByFacility(facilityId: number): Promise<any[]>;
    getLowStock(threshold: number): Promise<any[]>;
    checkStock(variant_id: number, facility_id: number): Promise<any>;
    getVariantLevel(facilityId: number, variantId: number): Promise<any>;
    getMovements(filters: any): Promise<{
        rows: import("../models/inventory_movement.model.js").default[];
        count: number;
    }>;
}
export declare const inventoryRepository: InventoryRepository;
export {};
//# sourceMappingURL=inventory.repository.d.ts.map