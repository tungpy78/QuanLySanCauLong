import sequelize from "../config/database.js";
import { productRepository } from "../repositories/product.repository.js";
import { variantRepository } from "../repositories/variant.repository.js";
import ApiError from '../utils/ErrorClass.js';
export class ProductService {
    static async getAllProducts(facilityId) {
        return productRepository.getAllProducts(facilityId);
    }
    static async getBySlug(slug) {
        return productRepository.getBySlug(slug);
    }
    static async getProductDetail(productId) {
        const product = await productRepository.getDetail(productId);
        if (!product) {
            throw new ApiError('Sản phẩm không tồn tại', 404);
        }
        return product;
    }
    static async updateProduct(productId, data) {
        const product = await productRepository.findById(productId);
        if (!product) {
            throw new ApiError('Sản phẩm không tồn tại', 404);
        }
        return product.update(data);
    }
    static async getVariantsByProductId(productId) {
        const product = await productRepository.findById(productId);
        if (!product) {
            throw new ApiError('Sản phẩm không tồn tại', 404);
        }
        return variantRepository.getByProductId(productId);
    }
    static async searchProduct(filters) {
        return productRepository.search(filters);
    }
    static async createProduct(data) {
        const transaction = await sequelize.transaction();
        try {
            const { variants, default_variant, ...productData } = data;
            let variantData = [];
            if (variants &&
                variants.length > 0) {
                variantData = variants;
            }
            else {
                variantData = [
                    {
                        sku: default_variant.sku,
                        price_cents: default_variant.price_cents,
                        attributes: null
                    }
                ];
            }
            const product = await productRepository
                .createWithVariants(productData, variantData, transaction);
            await transaction.commit();
            return product;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    static async toggleProductDeletion(productId) {
        const product = await productRepository.findById(productId, {
            paranoid: false
        });
        if (!product) {
            throw new ApiError('Sản phẩm không tồn tại', 404);
        }
        if (product.deleted_at) {
            await productRepository.restore(productId);
            return {
                message: 'Đã khôi phục và tự động kích hoạt sản phẩm',
                status: 'restored',
                is_active: true,
                deleted_at: null
            };
        }
        await productRepository
            .softDeleteProduct(product);
        return {
            message: 'Đã vô hiệu hóa và xóa mềm sản phẩm',
            status: 'deleted',
            is_active: false,
            deleted_at: new Date()
        };
    }
    static async addVariantsToProduct(productId, variantsData) {
        const product = await productRepository.findById(productId);
        if (!product) {
            throw new ApiError('Sản phẩm không tồn tại', 404);
        }
        const variantsToCreate = variantsData.map(variant => ({
            ...variant,
            product_id: productId
        }));
        return variantRepository
            .bulkCreateVariants(variantsToCreate);
    }
    static async updateVariant(variantId, updateData) {
        const variant = await variantRepository
            .findById(variantId);
        if (!variant) {
            throw new ApiError('Biến thể sản phẩm không tồn tại', 404);
        }
        return variantRepository.update(variantId, updateData);
    }
    static async toggleVariantDeletion(variantId) {
        const variant = await variantRepository
            .findById(variantId, {
            paranoid: false
        });
        if (!variant) {
            throw new ApiError('Biến thể sản phẩm không tồn tại', 404);
        }
        if (variant.deleted_at) {
            await variantRepository.restore(variantId);
            return {
                message: 'Đã khôi phục và kích hoạt lại biến thể',
                status: 'restored',
                is_active: true,
                deleted_at: null
            };
        }
        await variantRepository
            .softDeleteVariant(variant);
        return {
            message: 'Đã vô hiệu hóa và xóa mềm biến thể',
            status: 'deleted',
            is_active: false,
            deleted_at: new Date()
        };
    }
}
//# sourceMappingURL=product.service.js.map