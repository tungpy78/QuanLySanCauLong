import React from 'react';
import { Table, Tag, Select, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { RevenueTransaction, RevenueSource, RevenueProvider } from '../types/revenue.types';

interface RevenueTableProps {
  data: RevenueTransaction[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  source: RevenueSource | 'all';
  provider: RevenueProvider | 'all';
  onSourceChange: (src: RevenueSource | 'all') => void;
  onProviderChange: (prov: RevenueProvider | 'all') => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export const RevenueTable: React.FC<RevenueTableProps> = ({
  data,
  loading,
  pagination,
  source,
  provider,
  onSourceChange,
  onProviderChange,
  onPageChange,
}) => {
  const columns: ColumnsType<RevenueTransaction> = [
    {
      title: 'Mã GD',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: number) => <span className="font-medium text-gray-700">#{id}</span>,
    },
    {
      title: 'Nguồn',
      dataIndex: 'source',
      key: 'source',
      width: 180,
      render: (sourceVal: RevenueSource, record: RevenueTransaction) => {
        const isBooking = sourceVal === 'booking';
        const refId = record.bookingId || record.orderId || record.id;
        return (
          <Space>
            <Tag color={isBooking ? 'blue' : 'orange'}>
              {isBooking ? 'Đặt sân' : 'Bán hàng/POS'}
            </Tag>
            <span className="text-xs text-gray-400">Ref: #{refId}</span>
          </Space>
        );
      },
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string | null) => name || <span className="text-gray-400 italic">Khách vãng lai</span>,
    },
    {
      title: 'Cơ sở',
      dataIndex: 'facilityName',
      key: 'facilityName',
      render: (name: string | null) => name || <span className="text-gray-400 italic">Toàn hệ thống</span>,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: number) => (
        <span className="font-bold text-gray-800">
          {(amount || 0).toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Phương thức',
      dataIndex: 'provider',
      key: 'provider',
      width: 130,
      render: (prov: RevenueProvider) => {
        const isVNPay = prov === 'vnpay';
        return (
          <Tag color={isVNPay ? 'cyan' : 'gold'}>
            {isVNPay ? 'VNPay (QR)' : 'Tiền mặt'}
          </Tag>
        );
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : ''),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: () => <Tag color="success">Đã thanh toán</Tag>,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 m-0">Danh sách giao dịch doanh thu</h3>
        <Space size="middle" className="flex-wrap">
          <Space size="small">
            <span className="text-gray-400 text-xs font-medium">Nguồn:</span>
            <Select
              value={source}
              onChange={onSourceChange}
              size="small"
              className="w-32"
              options={[
                { value: 'all', label: 'Tất cả nguồn' },
                { value: 'booking', label: 'Đặt sân' },
                { value: 'order', label: 'Bán hàng/POS' },
              ]}
            />
          </Space>

          <Space size="small">
            <span className="text-gray-400 text-xs font-medium">Phương thức:</span>
            <Select
              value={provider}
              onChange={onProviderChange}
              size="small"
              className="w-32"
              options={[
                { value: 'all', label: 'Tất cả PTTT' },
                { value: 'cash', label: 'Tiền mặt' },
                { value: 'vnpay', label: 'VNPay' },
              ]}
            />
          </Space>
        </Space>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: (page: number, pageSize: number) => onPageChange(page, pageSize),
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Tổng cộng ${total} giao dịch`,
        }}
      />
    </div>
  );
};
