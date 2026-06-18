import sequelize from '../config/database.js';
import ApiError from '../utils/ErrorClass.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { inventoryMovementRepository } from '../repositories/inventory-movement.repository.js';

export class InventoryService {
    static async adjustInventory(data: {
        variant_id: number;
        facility_id: number;
        qty_delta: number;
        reason: 'sale' | 'return' | 'adjustment' | 'import';
        note?: string;
        ref_order_id?: number;
    },
        options: { transaction?: any } = {}
    ) {
        const transaction = options.transaction || await sequelize.transaction();

        const isOuterTransaction = !!options.transaction;
        try {
            const [inventory] = await inventoryRepository.findOrCreateInventory(data.variant_id, data.facility_id, transaction);
            const newQuantity = inventory.quantity_on_hand + data.qty_delta;

            if (newQuantity < 0) {
                throw new ApiError('Số lượng tồn kho không đủ', 400);
            }

            await inventory.update({ quantity_on_hand: newQuantity }, { transaction });
            await inventoryMovementRepository.createMovement(
                {
                    variant_id: data.variant_id,
                    facility_id: data.facility_id,
                    qty_delta: data.qty_delta,
                    reason: data.reason,
                    ref_order_id: data.ref_order_id,
                    note: data.note
                },
                transaction
            );

            if (!isOuterTransaction) {
                await transaction.commit();
            }
            return inventory;
        } catch (error) {
            if (!isOuterTransaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    static async getLevelsByFacility(facilityId: number) {
        return inventoryRepository.getLevelsByFacility(facilityId);
    }

    static async transferStock(data: {
        variant_id: number;
        from_facility_id: number;
        to_facility_id: number;
        quantity: number;
        note?: string;
    }) {
        if (data.from_facility_id === data.to_facility_id) {
            throw new ApiError('Cơ sở gửi và nhận phải khác nhau', 400);
        }

        const transaction = await sequelize.transaction();
        try {
            // Xuất kho từ cơ sở A
            await this.adjustInventory({
                variant_id: data.variant_id,
                facility_id: data.from_facility_id,
                qty_delta: -data.quantity,
                reason: 'adjustment',
                note: `Chuyển sang cơ sở ${data.to_facility_id}. ${data.note || ''}`
            }, { transaction });

            // Nhập kho vào cơ sở B
            await this.adjustInventory({
                variant_id: data.variant_id,
                facility_id: data.to_facility_id,
                qty_delta: data.quantity,
                reason: 'import',
                note: `Nhận từ cơ sở ${data.from_facility_id}. ${data.note || ''}`
            }, { transaction });

            await transaction.commit();
            return { message: "Chuyển kho hoàn tất" };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async getMovements(filters: any) {
        return inventoryMovementRepository.getMovements(filters, filters.limit || 20, filters.offset || 0);
    }

    static async getLowStock(threshold: number = 5) {
        return inventoryRepository.getLowStock(threshold);
    }

    static async checkStock(variant_id: number, facility_id: number, quantity: number) {
        const inventory = await inventoryRepository.checkStock(variant_id, facility_id);
        return (inventory && inventory.quantity_on_hand >= quantity);
    }

    static async getVariantLevel(facilityId: number, variantId: number) {
        const result = await inventoryRepository.getVariantLevel(facilityId, variantId);
        if (!result) {
            throw new ApiError('Không tìm thấy thông tin tồn kho cho biến thể này tại cơ sở được chọn', 404);
        }
        return result;
    }

}