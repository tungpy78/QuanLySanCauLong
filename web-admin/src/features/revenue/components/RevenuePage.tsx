import React from 'react';
import { Navigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../auth/store/auth.store';
import { useRevenue } from '../hooks/useRevenue';
import { RevenueFilterBar } from './RevenueFilterBar';
import { RevenueSummaryCards } from './RevenueSummaryCards';
import { RevenueChartContainer } from './RevenueChartContainer';
import { RevenueBreakdown } from './RevenueBreakdown';
import { RevenueTable } from './RevenueTable';

export const RevenuePage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/booking/schedule" replace />;
  }

  const {
    filters,
    pagination,
    summary,
    chartData,
    breakdown,
    transactions,
    loading,
    error,
    refresh,
    handleDateRangeChange,
    handleFacilityChange,
    handleGroupByChange,
    handleSourceChange,
    handleProviderChange,
    handlePageChange,
  } = useRevenue();

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 m-0">Thống kê Doanh thu</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={refresh}
          loading={loading}
          type="text"
          className="text-gray-500 hover:text-blue-600"
        >
          Làm mới dữ liệu
        </Button>
      </div>

      {error && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          action={
            <Button size="small" danger onClick={refresh}>
              Thử lại
            </Button>
          }
        />
      )}

      <RevenueFilterBar
        from={filters.from}
        to={filters.to}
        facilityId={filters.facility_id}
        onDateRangeChange={handleDateRangeChange}
        onFacilityChange={handleFacilityChange}
        onRefresh={refresh}
        loading={loading}
      />

      <RevenueSummaryCards data={summary} loading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <RevenueChartContainer
            data={chartData}
            loading={loading}
            groupBy={filters.groupBy}
            onGroupByChange={handleGroupByChange}
          />
        </div>
        <div>
          <RevenueBreakdown data={breakdown} loading={loading} />
        </div>
      </div>

      <RevenueTable
        data={transactions}
        loading={loading}
        pagination={pagination}
        source={filters.source}
        provider={filters.provider}
        onSourceChange={handleSourceChange}
        onProviderChange={handleProviderChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RevenuePage;
