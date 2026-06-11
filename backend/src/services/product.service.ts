import sequelize from "../config/database.js";
import { productRepository } from "../repositories/product.repository.js";
import { variantRepository } from "../repositories/variant.repository.js";
import type { SearchProductDto } from '../types/product.types.js';
import ApiError from '../utils/ErrorClass.js';

export class ProductService {
    static async getAllProducts(facilityId?: number) {
        return productRepository.getAllProducts(
            facilityId
        );
    }

    static async getBySlug(slug: string) {
        return productRepository.getBySlug(slug);
    }

    static async getProductDetail(
        productId: number
    ) {

        const product =
            await productRepository.getDetail(
                productId
            );

        if (!product) {
            throw new ApiError(
                'Sản phẩm không tồn tại',
                404
            );
        }

        return product;
    }

    static async updateProduct(
        productId: number,
        data: any
    ) {

        const product =
            await productRepository.findById(
                productId
            );

        if (!product) {
            throw new ApiError(
                'Sản phẩm không tồn tại',
                404
            );
        }

        return product.update(data);
    }

    static async getVariantsByProductId(
        productId: number
    ) {

        const product =
            await productRepository.findById(
                productId
            );

        if (!product) {
            throw new ApiError(
                'Sản phẩm không tồn tại',
                404
            );
        }

        return variantRepository.getByProductId(productId);
    }

    static async searchProduct(
        filters: SearchProductDto
    ) {
        return productRepository.search(
            filters
        );
    }

    static async createProduct(data: any) {
        const transaction =
            await sequelize.transaction();

        try {

            const {
                variants,
                default_variant,
                ...productData
            } = data;

            let variantData = [];

            if (
                variants &&
                variants.length > 0
            ) {
                variantData = variants;
            } else {

                variantData = [
                    {
                        sku:
                            default_variant.sku,

                        price_cents:
                            default_variant.price_cents,

                        attributes: null
                    }
                ];
            }

            const product =
                await productRepository
                    .createWithVariants(
                        productData,
                        variantData,
                        transaction
                    );

            await transaction.commit();

            return product;

        } catch (error) {

            await transaction.rollback();

            throw error;
        }
    }

    static async toggleProductDeletion(
        productId: number
    ) {
        const product =
            await productRepository.findById(
                productId,
                {
                    paranoid: false
                }
            );

        if (!product) {
            throw new ApiError(
                'Sản phẩm không tồn tại',
                404
            );
        }

        if (product.deleted_at) {
            await productRepository.restore(
                productId
            );

            return {
                message:
                    'Đã khôi phục và tự động kích hoạt sản phẩm',

                status:
                    'restored',

                is_active:
                    true,

                deleted_at:
                    null
            };
        }

        await productRepository
            .softDeleteProduct(product);

        return {
            message:
                'Đã vô hiệu hóa và xóa mềm sản phẩm',

            status:
                'deleted',

            is_active:
                false,

            deleted_at:
                new Date()
        };
    }

    static async addVariantsToProduct(
        productId: number,
        variantsData: any[]
    ) {

        const product =
            await productRepository.findById(
                productId
            );

        if (!product) {
            throw new ApiError(
                'Sản phẩm không tồn tại',
                404
            );
        }

        const variantsToCreate =
            variantsData.map(
                variant => ({
                    ...variant,
                    product_id: productId
                })
            );

        return variantRepository
            .bulkCreateVariants(
                variantsToCreate
            );
    }

    static async updateVariant(
        variantId: number,
        updateData: any
    ) {

        const variant =
            await variantRepository
                .findById(variantId);

        if (!variant) {
            throw new ApiError(
                'Biến thể sản phẩm không tồn tại',
                404
            );
        }

        return variantRepository.update(
            variantId,
            updateData
        );
    }

    static async toggleVariantDeletion(
        variantId: number
    ) {

        const variant =
            await variantRepository
                .findById(
                    variantId,
                    {
                        paranoid: false
                    }
                );

        if (!variant) {
            throw new ApiError(
                'Biến thể sản phẩm không tồn tại',
                404
            );
        }

        if (variant.deleted_at) {
            await variantRepository.restore(
                variantId
            );

            return {
                message:
                    'Đã khôi phục và kích hoạt lại biến thể',

                status:
                    'restored',

                is_active:
                    true,

                deleted_at:
                    null
            };
        }

        await variantRepository
            .softDeleteVariant(
                variant
            );

        return {
            message:
                'Đã vô hiệu hóa và xóa mềm biến thể',

            status:
                'deleted',

            is_active:
                false,

                deleted_at:
                    new Date()
            };
    }
}
