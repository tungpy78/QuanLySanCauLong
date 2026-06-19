export interface AdjustInventoryDto {
    variant_id: number;
    facility_id: number;
    qty_delta: number;
    reason: 'sale' | 'return' | 'adjustment' | 'import';
    note?: string;
    ref_order_id?: number;
}
export interface TransferStockDto {
    variant_id: number;
    from_facility_id: number;
    to_facility_id: number;
    quantity: number;
    note?: string;
}
//# sourceMappingURL=inventory.types.d.ts.map