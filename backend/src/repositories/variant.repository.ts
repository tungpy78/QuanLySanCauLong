import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class VariantRepository
    extends BaseRepository<any> {

    constructor() {
        super(models.ProductVariant as any);
    }

    async getByProductId(productId: number) {
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

    async bulkCreateVariants(data: any[]) {
        return this.model.bulkCreate(data);
    }

    async restoreVariant(variant: any) {
        await variant.restore();

        await variant.update({
            is_active: true
        });
    }

    async softDeleteVariant(variant: any) {
        await variant.update({
            is_active: false
        });

        await variant.destroy();
    }
}

export const variantRepository = new VariantRepository();