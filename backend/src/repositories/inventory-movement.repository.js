import models from '../models/index.js';
class InventoryMovementRepository {
    async createMovement(data, transaction) {
        return models.InventoryMovement.create(data, { transaction });
    }
    async getMovements(where, limit, offset) {
        return models.InventoryMovement.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variant',
                    include: [
                        {
                            model: models.Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });
    }
}
export const inventoryMovementRepository = new InventoryMovementRepository();
//# sourceMappingURL=inventory-movement.repository.js.map