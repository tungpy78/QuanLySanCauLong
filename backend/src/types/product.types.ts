export interface SearchProductDto {
    search?: string;

    category?: string;

    min_price?: number;

    max_price?: number;

    rating?: number;

    page?: number;

    limit?: number;
}