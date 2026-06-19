import dayjs from 'dayjs';
import { revenueRepository } from '../repositories/revenue.repository.js';
import ApiError from '../utils/ErrorClass.js';

export class RevenueService {
  /**
   * Chuẩn hóa bộ lọc thời gian và cơ sở
   */
  private static async resolveFilters(from?: string, to?: string, facilityId?: number) {
    // Mặc định 30 ngày gần nhất
    const fromStr = from || dayjs().subtract(29, 'day').format('YYYY-MM-DD');
    const toStr = to || dayjs().format('YYYY-MM-DD');

    const fromDate = dayjs(fromStr).startOf('day').toDate();
    const toDate = dayjs(toStr).endOf('day').toDate();

    let scope: 'all' | 'facility' = 'all';
    let resolvedFacilityId: number | null = null;
    let facilityName: string | null = null;

    if (facilityId) {
      const facility = await revenueRepository.getFacilityById(facilityId);
      if (!facility) {
        throw new ApiError('Cơ sở không tồn tại trong hệ thống!', 404);
      }
      scope = 'facility';
      resolvedFacilityId = facility.id;
      facilityName = facility.name;
    }

    return {
      fromStr,
      toStr,
      fromDate,
      toDate,
      scope,
      facilityId: resolvedFacilityId,
      facilityName
    };
  }

  /**
   * Tính toán summary doanh thu
   */
  static async getSummary(filters: { from?: string; to?: string; facility_id?: number }) {
    const { fromStr, toStr, fromDate, toDate, scope, facilityId, facilityName } = 
      await this.resolveFilters(filters.from, filters.to, filters.facility_id);

    const payments = await revenueRepository.getPaymentsForRevenue({
      from: fromDate,
      to: toDate,
      facilityId: facilityId || undefined
    });

    let totalRevenue = 0;
    let bookingRevenue = 0;
    let orderRevenue = 0;
    let cashRevenue = 0;
    let vnpayRevenue = 0;

    const paidBookingIds = new Set<number>();
    const paidOrderIds = new Set<number>();

    for (const p of payments) {
      const amount = p.amount_cents;
      totalRevenue += amount;

      if (p.booking_id) {
        bookingRevenue += amount;
        paidBookingIds.add(p.booking_id);
      } else if (p.order_id) {
        orderRevenue += amount;
        paidOrderIds.add(p.order_id);
      }

      if (p.provider === 'cash') {
        cashRevenue += amount;
      } else if (p.provider === 'vnpay') {
        vnpayRevenue += amount;
      }
    }

    const totalTransactions = payments.length;
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      scope,
      facilityId,
      facilityName,
      from: fromStr,
      to: toStr,
      totalRevenue,
      bookingRevenue,
      orderRevenue,
      paidBookingCount: paidBookingIds.size,
      paidOrderCount: paidOrderIds.size,
      cashRevenue,
      vnpayRevenue,
      averageTransactionValue: Math.round(averageTransactionValue)
    };
  }

  /**
   * Lấy dữ liệu vẽ chart
   */
  static async getChart(filters: { from?: string; to?: string; facility_id?: number; group_by: 'day' | 'month' }) {
    const { fromStr, toStr, fromDate, toDate, facilityId } = 
      await this.resolveFilters(filters.from, filters.to, filters.facility_id);

    const payments = await revenueRepository.getPaymentsForRevenue({
      from: fromDate,
      to: toDate,
      facilityId: facilityId || undefined
    });

    const chartMap = new Map<string, { label: string; date: string; bookingRevenue: number; orderRevenue: number; totalRevenue: number }>();

    // Khởi tạo trước các mốc thời gian để điền khuyết doanh thu bằng 0
    if (filters.group_by === 'day') {
      let current = dayjs(fromStr);
      const end = dayjs(toStr);
      while (current.isBefore(end) || current.isSame(end, 'day')) {
        const label = current.format('YYYY-MM-DD');
        chartMap.set(label, {
          label,
          date: label,
          bookingRevenue: 0,
          orderRevenue: 0,
          totalRevenue: 0
        });
        current = current.add(1, 'day');
      }
    } else {
      let current = dayjs(fromStr).startOf('month');
      const end = dayjs(toStr).startOf('month');
      while (current.isBefore(end) || current.isSame(end, 'month')) {
        const label = current.format('YYYY-MM');
        const dateStr = current.format('YYYY-MM-01');
        chartMap.set(label, {
          label,
          date: dateStr,
          bookingRevenue: 0,
          orderRevenue: 0,
          totalRevenue: 0
        });
        current = current.add(1, 'month');
      }
    }

    // Cộng dồn doanh thu thực tế vào các mốc thời gian tương ứng
    for (const p of payments) {
      const paidAt = p.paid_at || p.created_at;
      const key = filters.group_by === 'day' 
        ? dayjs(paidAt).format('YYYY-MM-DD') 
        : dayjs(paidAt).format('YYYY-MM');

      const chartItem = chartMap.get(key);
      if (chartItem) {
        const amount = p.amount_cents;
        if (p.booking_id) {
          chartItem.bookingRevenue += amount;
        } else if (p.order_id) {
          chartItem.orderRevenue += amount;
        }
        chartItem.totalRevenue += amount;
      }
    }

    return Array.from(chartMap.values());
  }

  /**
   * Lấy breakdown phân tích tỷ lệ doanh thu
   */
  static async getBreakdown(filters: { from?: string; to?: string; facility_id?: number }) {
    const { fromDate, toDate, facilityId } = 
      await this.resolveFilters(filters.from, filters.to, filters.facility_id);

    const payments = await revenueRepository.getPaymentsForRevenue({
      from: fromDate,
      to: toDate,
      facilityId: facilityId || undefined
    });

    let booking = 0;
    let order = 0;
    let cash = 0;
    let vnpay = 0;

    for (const p of payments) {
      const amount = p.amount_cents;
      if (p.booking_id) {
        booking += amount;
      } else if (p.order_id) {
        order += amount;
      }

      if (p.provider === 'cash') {
        cash += amount;
      } else if (p.provider === 'vnpay') {
        vnpay += amount;
      }
    }

    return {
      bySource: {
        booking,
        order
      },
      byProvider: {
        cash,
        vnpay
      }
    };
  }

  /**
   * Lấy danh sách giao dịch phân trang
   */
  static async getTransactions(filters: {
    from?: string;
    to?: string;
    facility_id?: number;
    source: 'booking' | 'order' | 'all';
    provider: 'cash' | 'vnpay' | 'all';
    page: number;
    limit: number;
    sortBy: 'paidAt' | 'amount';
    sortOrder: 'asc' | 'desc';
  }) {
    const { fromDate, toDate, facilityId } = 
      await this.resolveFilters(filters.from, filters.to, filters.facility_id);

    const offset = (filters.page - 1) * filters.limit;

    const { count, rows } = await revenueRepository.getTransactions({
      from: fromDate,
      to: toDate,
      facilityId: facilityId || undefined,
      source: filters.source,
      provider: filters.provider,
      limit: filters.limit,
      offset,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    });

    const transactions = rows.map((p: any) => {
      const source = p.booking_id ? 'booking' : (p.order_id ? 'order' : 'unknown');
      const facilityName = p.booking?.facility?.name || p.order?.facility?.name || null;
      
      let customerName = 'Khách lẻ (POS)';
      if (p.booking?.user?.full_name) {
        customerName = p.booking.user.full_name;
      } else if (p.order?.user?.full_name) {
        customerName = p.order.user.full_name;
      }

      return {
        id: p.id,
        source,
        amount: p.amount_cents,
        provider: p.provider,
        paidAt: p.paid_at || p.created_at,
        bookingId: p.booking_id,
        orderId: p.order_id,
        facilityName,
        customerName,
        status: p.status
      };
    });

    return {
      total: count,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(count / filters.limit),
      transactions
    };
  }
}
