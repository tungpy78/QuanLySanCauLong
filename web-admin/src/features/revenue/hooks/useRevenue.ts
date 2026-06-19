import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { RevenueService } from '../services/revenue.service';
import type {
  RevenueQueryParams,
  RevenueChartQueryParams,
  RevenueTransactionQueryParams,
  RevenueSummaryData,
  RevenueChartItem,
  RevenueBreakdownData,
  RevenueTransaction,
  RevenueSource,
  RevenueProvider,
  RevenueGroupBy,
} from '../types/revenue.types';

export const useRevenue = () => {
  const [fromDate, setFromDate] = useState<string>(
    dayjs().subtract(29, 'day').format('YYYY-MM-DD')
  );
  const [toDate, setToDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [facilityId, setFacilityId] = useState<number | undefined>(undefined);
  const [groupBy, setGroupBy] = useState<RevenueGroupBy>('day');

  // Filters riêng cho bảng Transactions
  const [source, setSource] = useState<RevenueSource | 'all'>('all');
  const [provider, setProvider] = useState<RevenueProvider | 'all'>('all');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // States chứa dữ liệu
  const [summary, setSummary] = useState<RevenueSummaryData | null>(null);
  const [chartData, setChartData] = useState<RevenueChartItem[]>([]);
  const [breakdown, setBreakdown] = useState<RevenueBreakdownData | null>(null);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: RevenueQueryParams = {
        from: fromDate,
        to: toDate,
        facility_id: facilityId,
      };

      const chartParams: RevenueChartQueryParams = {
        ...queryParams,
        group_by: groupBy,
      };

      const transParams: RevenueTransactionQueryParams = {
        ...queryParams,
        source,
        provider,
        page,
        limit,
      };

      const [summaryRes, chartRes, breakdownRes, transRes] = await Promise.all([
        RevenueService.getSummary(queryParams),
        RevenueService.getChart(chartParams),
        RevenueService.getBreakdown(queryParams),
        RevenueService.getTransactions(transParams),
      ]);

      setSummary(summaryRes);
      setChartData(chartRes || []);
      setBreakdown(breakdownRes);
      setTransactions(transRes?.transactions || []);
      setTotalTransactions(transRes?.total || 0);
    } catch (err: unknown) {
      console.error('Lỗi khi fetch dữ liệu doanh thu:', err);
      const errMsg = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
      setError(errMsg);
      message.error('Lỗi tải dữ liệu doanh thu!');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, facilityId, groupBy, source, provider, page, limit]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const handleDateRangeChange = (dates: [string, string]) => {
    setFromDate(dates[0]);
    setToDate(dates[1]);
    setPage(1);
  };

  const handleFacilityChange = (id: number | undefined) => {
    setFacilityId(id);
    setPage(1);
  };

  const handleGroupByChange = (group: RevenueGroupBy) => {
    setGroupBy(group);
  };

  const handleSourceChange = (src: RevenueSource | 'all') => {
    setSource(src);
    setPage(1);
  };

  const handleProviderChange = (prov: RevenueProvider | 'all') => {
    setProvider(prov);
    setPage(1);
  };

  const handlePageChange = (p: number, l?: number) => {
    setPage(p);
    if (l) setLimit(l);
  };

  return {
    filters: {
      from: fromDate,
      to: toDate,
      facility_id: facilityId,
      groupBy,
      source,
      provider,
    },
    pagination: {
      page,
      limit,
      total: totalTransactions,
    },
    summary,
    chartData,
    breakdown,
    transactions,
    loading,
    error,
    refresh: fetchRevenueData,
    handleDateRangeChange,
    handleFacilityChange,
    handleGroupByChange,
    handleSourceChange,
    handleProviderChange,
    handlePageChange,
  };
};
