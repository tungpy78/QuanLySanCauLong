import { BaseRepository } from './base.repository.js';
declare class VariantRepository extends BaseRepository<any> {
    constructor();
    getByProductId(productId: number): Promise<any[]>;
    bulkCreateVariants(data: any[]): Promise<any[]>;
    restoreVariant(variant: any): Promise<void>;
    softDeleteVariant(variant: any): Promise<void>;
}
export declare const variantRepository: VariantRepository;
export {};
//# sourceMappingURL=variant.repository.d.ts.map