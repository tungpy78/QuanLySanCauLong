import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';
import { Op } from 'sequelize';
class ProductRepository extends BaseRepository {
    constructor() {
        super(models.Product);
    }
    async getAllProducts(facilityId) {
        return this.findAll({
            where: {
                is_active: true
            },
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variants',
                    required: !!facilityId,
                    include: [
                        {
                            model: models.InventoryLevel,
                            as: 'inventory_levels',
                            required: false,
                            ...(facilityId ? { where: { facility_id: facilityId } } : {})
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }
    async getBySlug(slug) {
        return this.findOne({
            where: {
                slug,
                is_active: true
            },
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variants'
                }
            ]
        });
    }
    async getDetail(productId) {
        return this.findById(productId, {
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variants',
                    include: [
                        {
                            model: models.InventoryLevel,
                            as: 'inventory_levels'
                        }
                    ]
                }
            ]
        });
    }
    async search(filters) {
        const { search, category, min_price, max_price, rating, page = 1, limit = 20 } = filters;
        const productWhere = {
            is_active: true
        };
        const variantWhere = {
            is_active: true
        };
        // category
        if (category) {
            productWhere.category = category;
        }
        // rating
        if (rating) {
            productWhere.rating = {
                [Op.gte]: Number(rating)
            };
        }
        // search product name hoặc slug
        if (search) {
            productWhere[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    slug: {
                        [Op.like]: `%${search}%`
                    }
                }
            ];
        }
        // filter giá
        if (min_price || max_price) {
            variantWhere.price_cents = {};
            if (min_price) {
                variantWhere.price_cents[Op.gte] =
                    Number(min_price);
            }
            if (max_price) {
                variantWhere.price_cents[Op.lte] =
                    Number(max_price);
            }
        }
        // search SKU
        if (search) {
            variantWhere.sku = {
                [Op.like]: `%${search}%`
            };
        }
        return this.model.findAndCountAll({
            where: productWhere,
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variants',
                    required: true,
                    where: variantWhere,
                    include: [
                        {
                            model: models.InventoryLevel,
                            as: 'inventory_levels',
                            required: false
                        }
                    ]
                }
            ],
            offset: (Number(page) - 1) *
                Number(limit),
            limit: Number(limit),
            distinct: true,
            order: [
                ['created_at', 'DESC']
            ]
        });
    }
    async createWithVariants(productData, variants, transaction) {
        return this.model.create({
            ...productData,
            variants
        }, {
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variants'
                }
            ],
            transaction
        });
    }
    async restoreProduct(product) {
        await product.restore();
        await product.update({
            is_active: true
        });
    }
    async softDeleteProduct(product) {
        await product.update({
            is_active: false
        });
        await product.destroy();
    }
}
export const productRepository = new ProductRepository();
//# sourceMappingURL=product.repository.js.map