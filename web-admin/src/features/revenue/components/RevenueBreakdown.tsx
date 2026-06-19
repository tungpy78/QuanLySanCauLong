import React from 'react';
import { Card, Empty } from 'antd';
import { Pie } from '@ant-design/charts';
import type { RevenueBreakdownData } from '../types/revenue.types';

interface RevenueBreakdownProps {
  data: RevenueBreakdownData | null;
  loading: boolean;
}

export const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({ data, loading }) => {
  const typeData = React.useMemo(() => {
    const booking = data?.bySource?.booking ?? 0;
    const order = data?.bySource?.order ?? 0;
    return [
      { type: 'Đặt sân', value: booking },
      { type: 'Bán hàng/POS', value: order },
    ].filter((item) => item.value > 0);
  }, [data]);

  const paymentData = React.useMemo(() => {
    const cash = data?.byProvider?.cash ?? 0;
    const vnpay = data?.byProvider?.vnpay ?? 0;
    return [
      { type: 'Tiền mặt', value: cash },
      { type: 'VNPay', value: vnpay },
    ].filter((item) => item.value > 0);
  }, [data]);

  const typeConfig = {
    data: typeData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
      },
    },
    tooltip: {
      valueFormatter: (v: unknown) => {
        if (typeof v === 'number') {
          return `${v.toLocaleString('vi-VN')} VNĐ`;
        }
        return '';
      },
    },
  };

  const paymentConfig = {
    data: paymentData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    legend: {
      color: {
        position: 'bottom',
        layout: {
          justifyContent: 'center',
        },
      },
    },
    tooltip: {
      valueFormatter: (v: unknown) => {
        if (typeof v === 'number') {
          return `${v.toLocaleString('vi-VN')} VNĐ`;
        }
        return '';
      },
    },
  };

  const hasData = !!data && (
    (data.bySource?.booking ?? 0) > 0 ||
    (data.bySource?.order ?? 0) > 0 ||
    (data.byProvider?.cash ?? 0) > 0 ||
    (data.byProvider?.vnpay ?? 0) > 0
  );

  return (
    <Card
      title="Cấu trúc doanh thu"
      bordered={false}
      className="shadow-sm mb-6 border border-gray-100 h-full"
      loading={loading}
    >
      {!loading && !hasData ? (
        <div className="py-12 flex justify-center items-center h-full">
          <Empty description="Không có dữ liệu phân tích" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-center font-medium text-gray-500 mb-4">Theo nguồn doanh thu</h4>
            <div className="h-64 flex justify-center items-center">
              {typeData.length > 0 ? (
                <Pie {...typeConfig} />
              ) : (
                <Empty description="Không có dữ liệu nguồn doanh thu" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>
          <div>
            <h4 className="text-center font-medium text-gray-500 mb-4">Theo phương thức thanh toán</h4>
            <div className="h-64 flex justify-center items-center">
              {paymentData.length > 0 ? (
                <Pie {...paymentConfig} />
              ) : (
                <Empty description="Không có dữ liệu phương thức" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
