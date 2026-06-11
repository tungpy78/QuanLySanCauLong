import type { WhereOptions } from 'sequelize/lib/model';
import models from '../models/index.js';
import type { SearchProductDto } from '../types/product.types.js';
import { BaseRepository } from './base.repository.js';
import { Op } from 'sequelize';

class ProductRepository extends BaseRepository<any> {

    constructor() {
        super(models.Product as any);
    }

    async getAllProducts(facilityId?: number) {
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
                            as: 'inventory', // Thay bằng alias thực tế của bạn nếu khác
                            required: false, // Thường để false nếu dùng left join
                            
                            // Sửa 'facility_id' thành 'facilityId' ở điều kiện kiểm tra và giá trị gán vào
                            ...(facilityId ? { where: { facility_id: facilityId } } : {})
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async getBySlug(slug: string) {
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

    async getDetail(productId: number) {
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

    async search(filters: SearchProductDto) {

        const {
            search,
            category,
            min_price,
            max_price,
            rating,
            page = 1,
            limit = 20
        } = filters;

        const productWhere: WhereOptions = {
            is_active: true
        };

        const variantWhere: any = {
            is_active: true
        };

        // category
        if (category) {
            (productWhere as any).category = category;
        }

        // rating
        if (rating) {
            (productWhere as any).rating = {
                [Op.gte]: Number(rating)
            };
        }

        // search product name hoặc slug
        if (search) {
            (productWhere as any)[Op.or] = [
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

                    where: variantWhere
                }
            ],

            offset:
                (Number(page) - 1) *
                Number(limit),

            limit: Number(limit),

            distinct: true,

            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    async createWithVariants(
        productData: any,
        variants: any[],
        transaction: any
    ) {
        return this.model.create(
            {
                ...productData,
                variants
            },
            {
                include: [
                    {
                        model: models.ProductVariant,
                        as: 'variants'
                    }
                ],
                transaction
            }
        );
    }

    async restoreProduct(product: any) {
        await product.restore();

        await product.update({
            is_active: true
        });
    }

    async softDeleteProduct(product: any) {
        await product.update({
            is_active: false
        });

        await product.destroy();
    }
}

export const productRepository =
    new ProductRepository();