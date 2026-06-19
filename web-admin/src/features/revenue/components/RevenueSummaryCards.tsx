import React from 'react';
import { Card } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  InteractionOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  AccountBookOutlined
} from '@ant-design/icons';
import type { RevenueSummaryData } from '../types/revenue.types';

interface RevenueSummaryCardsProps {
  data: RevenueSummaryData | null;
  loading: boolean;
}

export const RevenueSummaryCards: React.FC<RevenueSummaryCardsProps> = ({ data, loading }) => {
  const formatMoney = (cents: number) => {
    return (cents || 0).toLocaleString('vi-VN') + ' VNĐ';
  };

  const totalRevenue = data?.totalRevenue ?? 0;
  const bookingRevenue = data?.bookingRevenue ?? 0;
  const orderRevenue = data?.orderRevenue ?? 0;
  const cashRevenue = data?.cashRevenue ?? 0;
  const vnpayRevenue = data?.vnpayRevenue ?? 0;
  const totalBookings = data?.paidBookingCount ?? 0;
  const totalOrders = data?.paidOrderCount ?? 0;
  const avgTransactionValue = data?.averageTransactionValue ?? 0;

  const cardsConfig = [
    {
      title: 'Tổng doanh thu',
      value: formatMoney(totalRevenue),
      icon: <DollarOutlined className="text-2xl text-blue-600" />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Doanh thu đặt sân',
      value: formatMoney(bookingRevenue),
      icon: <CalendarOutlined className="text-2xl text-green-600" />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Doanh thu bán hàng/POS',
      value: formatMoney(orderRevenue),
      icon: <ShoppingCartOutlined className="text-2xl text-orange-600" />,
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Giá trị GD trung bình',
      value: formatMoney(avgTransactionValue),
      icon: <InteractionOutlined className="text-2xl text-purple-600" />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Doanh thu tiền mặt',
      value: formatMoney(cashRevenue),
      icon: <AccountBookOutlined className="text-2xl text-amber-600" />,
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Doanh thu VNPay',
      value: formatMoney(vnpayRevenue),
      icon: <CreditCardOutlined className="text-2xl text-cyan-600" />,
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Số booking đã thanh toán',
      value: totalBookings.toLocaleString('vi-VN'),
      icon: <CheckCircleOutlined className="text-2xl text-emerald-600" />,
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Số order đã thanh toán',
      value: totalOrders.toLocaleString('vi-VN'),
      icon: <SafetyCertificateOutlined className="text-2xl text-teal-600" />,
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cardsConfig.map((card, idx) => (
        <Card
          key={idx}
          bordered={false}
          loading={loading}
          className="shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="text-gray-500 text-sm font-medium mb-1 truncate">{card.title}</div>
              <div className="text-2xl font-bold text-gray-800 truncate">
                {loading ? '...' : card.value}
              </div>
            </div>
            <div className={`p-3 rounded-full flex-shrink-0 ${card.bgColor}`}>
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
