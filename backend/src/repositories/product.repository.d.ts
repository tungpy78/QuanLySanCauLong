import type { SearchProductDto } from '../types/product.types.js';
import { BaseRepository } from './base.repository.js';
declare class ProductRepository extends BaseRepository<any> {
    constructor();
    getAllProducts(facilityId?: number): Promise<any[]>;
    getBySlug(slug: string): Promise<any>;
    getDetail(productId: number): Promise<any>;
    search(filters: SearchProductDto): Promise<{
        rows: any[];
        count: number;
    }>;
    createWithVariants(productData: any, variants: any[], transaction: any): Promise<any>;
    restoreProduct(product: any): Promise<void>;
    softDeleteProduct(product: any): Promise<void>;
}
export declare const productRepository: ProductRepository;
export {};
//# sourceMappingURL=product.repository.d.ts.map