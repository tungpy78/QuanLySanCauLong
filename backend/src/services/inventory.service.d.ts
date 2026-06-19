export declare class InventoryService {
    static adjustInventory(data: {
        variant_id: number;
        facility_id: number;
        qty_delta: number;
        reason: 'sale' | 'return' | 'adjustment' | 'import';
        note?: string;
        ref_order_id?: number;
    }, options?: {
        transaction?: any;
    }): Promise<any>;
    static getLevelsByFacility(facilityId: number): Promise<any[]>;
    static transferStock(data: {
        variant_id: number;
        from_facility_id: number;
        to_facility_id: number;
        quantity: number;
        note?: string;
    }): Promise<{
        message: string;
    }>;
    static getMovements(filters: any): Promise<{
        rows: import("../models/inventory_movement.model.js").default[];
        count: number;
    }>;
    static getLowStock(threshold?: number): Promise<any[]>;
    static checkStock(variant_id: number, facility_id: number, quantity: number): Promise<any>;
    static getVariantLevel(facilityId: number, variantId: number): Promise<any>;
}
//# sourceMappingURL=inventory.service.d.ts.map