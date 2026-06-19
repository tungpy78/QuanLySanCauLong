import type { SearchProductDto } from '../types/product.types.js';
export declare class ProductService {
    static getAllProducts(facilityId?: number): Promise<any[]>;
    static getBySlug(slug: string): Promise<any>;
    static getProductDetail(productId: number): Promise<any>;
    static updateProduct(productId: number, data: any): Promise<any>;
    static getVariantsByProductId(productId: number): Promise<any[]>;
    static searchProduct(filters: SearchProductDto): Promise<{
        rows: any[];
        count: number;
    }>;
    static createProduct(data: any): Promise<any>;
    static toggleProductDeletion(productId: number): Promise<{
        message: string;
        status: string;
        is_active: boolean;
        deleted_at: null;
    } | {
        message: string;
        status: string;
        is_active: boolean;
        deleted_at: Date;
    }>;
    static addVariantsToProduct(productId: number, variantsData: any[]): Promise<any[]>;
    static updateVariant(variantId: number, updateData: any): Promise<any>;
    static toggleVariantDeletion(variantId: number): Promise<{
        message: string;
        status: string;
        is_active: boolean;
        deleted_at: null;
    } | {
        message: string;
        status: string;
        is_active: boolean;
        deleted_at: Date;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map