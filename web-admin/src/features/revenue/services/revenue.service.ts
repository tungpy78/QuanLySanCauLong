import axiosClient from '../../../config/axios';
import type { ApiResponse } from '../../../types/api.type';
import type {
  RevenueQueryParams,
  RevenueChartQueryParams,
  RevenueTransactionQueryParams,
  RevenueSummaryData,
  RevenueChartItem,
  RevenueBreakdownData,
  PaginatedRevenueTransactions,
} from '../types/revenue.types';

export const RevenueService = {
  getSummary: async (params?: RevenueQueryParams): Promise<RevenueSummaryData> => {
    const res = await axiosClient.get<unknown, ApiResponse<RevenueSummaryData>>('/admin/revenue/summary', { params });
    return res.data;
  },

  getChart: async (params?: RevenueChartQueryParams): Promise<RevenueChartItem[]> => {
    const res = await axiosClient.get<unknown, ApiResponse<RevenueChartItem[]>>('/admin/revenue/chart', { params });
    return res.data;
  },

  getBreakdown: async (params?: RevenueQueryParams): Promise<RevenueBreakdownData> => {
    const res = await axiosClient.get<unknown, ApiResponse<RevenueBreakdownData>>('/admin/revenue/breakdown', { params });
    return res.data;
  },

  getTransactions: async (params?: RevenueTransactionQueryParams): Promise<PaginatedRevenueTransactions> => {
    const formattedParams: Record<string, string | number | undefined> = {};
    if (params) {
      if (params.from) formattedParams.from = params.from;
      if (params.to) formattedParams.to = params.to;
      if (params.facility_id) formattedParams.facility_id = params.facility_id;
      if (params.source && params.source !== 'all') formattedParams.source = params.source;
      if (params.provider && params.provider !== 'all') formattedParams.provider = params.provider;
      if (params.page) formattedParams.page = params.page;
      if (params.limit) formattedParams.limit = params.limit;
    }
    const res = await axiosClient.get<unknown, ApiResponse<PaginatedRevenueTransactions>>('/admin/revenue/transactions', {
      params: formattedParams,
    });
    return res.data;
  },
};
