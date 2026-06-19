import React from 'react';
import { Card, Radio, Empty } from 'antd';
import { Column } from '@ant-design/charts';
import type { RadioChangeEvent } from 'antd';
import type { RevenueChartItem, RevenueGroupBy } from '../types/revenue.types';

interface RevenueChartContainerProps {
  data: RevenueChartItem[];
  loading: boolean;
  groupBy: RevenueGroupBy;
  onGroupByChange: (group: RevenueGroupBy) => void;
}

export const RevenueChartContainer: React.FC<RevenueChartContainerProps> = ({
  data,
  loading,
  groupBy,
  onGroupByChange,
}) => {
  const handleRadioChange = (e: RadioChangeEvent) => {
    onGroupByChange(e.target.value as RevenueGroupBy);
  };

  const chartSourceData = React.useMemo(() => {
    if (!data) return [];
    return data.flatMap((item) => [
      {
        date: item.date || item.label || '',
        value: item.bookingRevenue ?? 0,
        type: 'Doanh thu đặt sân',
      },
      {
        date: item.date || item.label || '',
        value: item.orderRevenue ?? 0,
        type: 'Doanh thu bán hàng',
      },
    ]);
  }, [data]);

  const hasNonZeroData = React.useMemo(() => {
    if (!data || data.length === 0) return false;
    return data.some(
      (item) => (item.bookingRevenue ?? 0) > 0 || (item.orderRevenue ?? 0) > 0
    );
  }, [data]);

  // Cấu hình tối giản, chuẩn hóa theo API Ant Design Charts v2 (G2 v5)
  // Tránh tùy biến sâu axis/tooltip sai cú pháp gây crash ngầm làm chart bị trắng
  const config = {
    data: chartSourceData,
    xField: 'date',
    yField: 'value',
    colorField: 'type',
    stack: true,
    legend: {
      color: {
        position: 'top',
        layout: {
          justifyContent: 'center',
        },
      },
    },
    // Để G2 v5 tự động render tooltip và scale trục Y mặc định
  };

  const showChart = !loading && data && data.length > 0 && hasNonZeroData;

  return (
    <Card
      title="Biểu đồ doanh thu"
      bordered={false}
      className="shadow-sm mb-6 border border-gray-100"
      extra={
        <Radio.Group value={groupBy} onChange={handleRadioChange} size="small" disabled={loading}>
          <Radio.Button value="day">Theo ngày</Radio.Button>
          <Radio.Button value="month">Theo tháng</Radio.Button>
        </Radio.Group>
      }
    >
      {!loading && !showChart ? (
        <div className="h-80 flex flex-col justify-center items-center">
          <Empty description="Không có dữ liệu doanh thu trong khoảng thời gian này" />
        </div>
      ) : (
        <div className="h-80 w-full">
          <Column {...config} />
        </div>
      )}
    </Card>
  );
};
