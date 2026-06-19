import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodString;
        category: z.ZodEnum<{
            racket: "racket";
            shuttlecock: "shuttlecock";
            shoes: "shoes";
            apparel: "apparel";
            accessory: "accessory";
        }>;
        description: z.ZodOptional<z.ZodString>;
        thumbnail_url: z.ZodOptional<z.ZodString>;
        default_variant: z.ZodOptional<z.ZodObject<{
            sku: z.ZodString;
            price_cents: z.ZodNumber;
        }, z.core.$strip>>;
        variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
            sku: z.ZodString;
            price_cents: z.ZodNumber;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export declare const updateProductSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodEnum<{
            racket: "racket";
            shuttlecock: "shuttlecock";
            shoes: "shoes";
            apparel: "apparel";
            accessory: "accessory";
        }>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        thumbnail_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rating: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        review_count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        is_active: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export declare const addVariantsSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        variants: z.ZodArray<z.ZodObject<{
            sku: z.ZodString;
            price_cents: z.ZodNumber;
            barcode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            attributes: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
            is_active: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateVariantSchema: z.ZodObject<{
    params: z.ZodObject<{
        variantId: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        sku: z.ZodOptional<z.ZodString>;
        price_cents: z.ZodOptional<z.ZodNumber>;
        barcode: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
        attributes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>>;
        is_active: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const ProductFilterDto: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    min_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    max_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    rating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodEnum<{
        rating: "rating";
        newest: "newest";
        oldest: "oldest";
        price_asc: "price_asc";
        price_desc: "price_desc";
    }>>;
    attrs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export type ProductFilterInput = z.infer<typeof ProductFilterDto>;
export type AddVariantsInput = z.infer<typeof addVariantsSchema>['body'];
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>['body'];
//# sourceMappingURL=product.validation.d.ts.map