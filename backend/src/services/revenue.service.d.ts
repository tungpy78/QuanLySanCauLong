export declare class RevenueService {
    /**
     * Chuẩn hóa bộ lọc thời gian và cơ sở
     */
    private static resolveFilters;
    /**
     * Tính toán summary doanh thu
     */
    static getSummary(filters: {
        from?: string;
        to?: string;
        facility_id?: number;
    }): Promise<{
        scope: "facility" | "all";
        facilityId: number | null;
        facilityName: string | null;
        from: string;
        to: string;
        totalRevenue: number;
        bookingRevenue: number;
        orderRevenue: number;
        paidBookingCount: number;
        paidOrderCount: number;
        cashRevenue: number;
        vnpayRevenue: number;
        averageTransactionValue: number;
    }>;
    /**
     * Lấy dữ liệu vẽ chart
     */
    static getChart(filters: {
        from?: string;
        to?: string;
        facility_id?: number;
        group_by: 'day' | 'month';
    }): Promise<{
        label: string;
        date: string;
        bookingRevenue: number;
        orderRevenue: number;
        totalRevenue: number;
    }[]>;
    /**
     * Lấy breakdown phân tích tỷ lệ doanh thu
     */
    static getBreakdown(filters: {
        from?: string;
        to?: string;
        facility_id?: number;
    }): Promise<{
        bySource: {
            booking: number;
            order: number;
        };
        byProvider: {
            cash: number;
            vnpay: number;
        };
    }>;
    /**
     * Lấy danh sách giao dịch phân trang
     */
    static getTransactions(filters: {
        from?: string;
        to?: string;
        facility_id?: number;
        source: 'booking' | 'order' | 'all';
        provider: 'cash' | 'vnpay' | 'all';
        page: number;
        limit: number;
        sortBy: 'paidAt' | 'amount';
        sortOrder: 'asc' | 'desc';
    }): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        transactions: {
            id: any;
            source: string;
            amount: any;
            provider: any;
            paidAt: any;
            bookingId: any;
            orderId: any;
            facilityName: any;
            customerName: string;
            status: any;
        }[];
    }>;
}
//# sourceMappingURL=revenue.service.d.ts.map