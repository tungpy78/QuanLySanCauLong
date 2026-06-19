export type RevenueScope = 'system' | 'facility';
export type RevenueSource = 'booking' | 'order';
export type RevenueProvider = 'cash' | 'vnpay';
export type RevenueGroupBy = 'day' | 'month';

export interface RevenueQueryParams {
  from?: string;
  to?: string;
  facility_id?: number;
}

export interface RevenueChartQueryParams extends RevenueQueryParams {
  group_by?: RevenueGroupBy;
}

export interface RevenueTransactionQueryParams extends RevenueQueryParams {
  source?: RevenueSource | 'all';
  provider?: RevenueProvider | 'all';
  page?: number;
  limit?: number;
}

export interface RevenueSummaryData {
  scope: 'all' | 'facility';
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
}

export interface RevenueChartItem {
  label: string;
  date: string;
  bookingRevenue: number;
  orderRevenue: number;
  totalRevenue: number;
}

export interface RevenueBreakdownData {
  bySource: {
    booking: number;
    order: number;
  };
  byProvider: {
    cash: number;
    vnpay: number;
  };
}

export interface RevenueTransaction {
  id: number;
  source: RevenueSource;
  amount: number;
  provider: RevenueProvider;
  paidAt: string;
  bookingId: number | null;
  orderId: number | null;
  facilityName: string | null;
  customerName: string;
  status: string;
}

export interface PaginatedRevenueTransactions {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  transactions: RevenueTransaction[];
}
