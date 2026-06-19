import { Model, type Optional } from 'sequelize';
export interface ProductAttributes {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string | null;
    thumbnail_url: string | null;
    rating: number;
    review_count: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'is_active' | 'description' | 'thumbnail_url' | 'rating' | 'review_count'> {
}
declare class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string | null;
    thumbnail_url: string | null;
    rating: number;
    review_count: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default Product;
//# sourceMappingURL=product.model.d.ts.map