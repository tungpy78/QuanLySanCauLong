export interface GetPaymentsFilter {
    from: Date;
    to: Date;
    facilityId?: number;
}
export interface GetTransactionsFilter extends GetPaymentsFilter {
    source: 'booking' | 'order' | 'all';
    provider: 'cash' | 'vnpay' | 'all';
    limit: number;
    offset: number;
    sortBy: 'paidAt' | 'amount';
    sortOrder: 'asc' | 'desc';
}
declare class RevenueRepository {
    /**
     * Lấy thông tin Facility theo ID
     */
    getFacilityById(id: number): Promise<import("../models/facility.model.js").default | null>;
    /**
     * Lấy toàn bộ payments có status = 'paid' phục vụ tính toán summary, chart, breakdown
     */
    getPaymentsForRevenue(filters: GetPaymentsFilter): Promise<import("../models/payment.model.js").default[]>;
    /**
     * Lấy danh sách giao dịch phân trang, filter và sort
     */
    getTransactions(filters: GetTransactionsFilter): Promise<{
        rows: import("../models/payment.model.js").default[];
        count: number;
    }>;
}
export declare const revenueRepository: RevenueRepository;
export {};
//# sourceMappingURL=revenue.repository.d.ts.map