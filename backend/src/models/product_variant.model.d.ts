import { Model, type Optional } from 'sequelize';
export interface ProductVariantAttributes {
    id: number;
    product_id: number;
    sku: string;
    attributes: any | null;
    price_cents: number;
    barcode: string | null;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface ProductVariantCreationAttributes extends Optional<ProductVariantAttributes, 'id' | 'is_active' | 'attributes' | 'barcode'> {
}
declare class ProductVariant extends Model<ProductVariantAttributes, ProductVariantCreationAttributes> implements ProductVariantAttributes {
    id: number;
    product_id: number;
    sku: string;
    attributes: any | null;
    price_cents: number;
    barcode: string | null;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default ProductVariant;
//# sourceMappingURL=product_variant.model.d.ts.map