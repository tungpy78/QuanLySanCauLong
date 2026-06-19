import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';
class VariantRepository extends BaseRepository {
    constructor() {
        super(models.ProductVariant);
    }
    async getByProductId(productId) {
        return this.findAll({
            where: {
                product_id: productId
            },
            include: [
                {
                    model: models.InventoryLevel,
                    as: 'inventory_levels',
                    required: false
                }
            ],
            order: [
                ['created_at', 'ASC']
            ]
        });
    }
    async bulkCreateVariants(data) {
        return this.model.bulkCreate(data);
    }
    async restoreVariant(variant) {
        await variant.restore();
        await variant.update({
            is_active: true
        });
    }
    async softDeleteVariant(variant) {
        await variant.update({
            is_active: false
        });
        await variant.destroy();
    }
}
export const variantRepository = new VariantRepository();
//# sourceMappingURL=variant.repository.js.map