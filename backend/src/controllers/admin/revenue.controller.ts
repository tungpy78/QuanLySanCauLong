import type { Request, Response, NextFunction } from 'express';
import { RevenueService } from '../../services/revenue.service.js';
import AppResponse from '../../utils/AppResponse.js';

export class RevenueController {
  /**
   * GET /api/v1/admin/revenue/summary
   */
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query as any;
      const result = await RevenueService.getSummary({
        from: filters.from,
        to: filters.to,
        facility_id: filters.facility_id ? Number(filters.facility_id) : undefined
      });
      return AppResponse.success(res, result, 'Lấy thông tin tổng quan doanh thu thành công', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/revenue/chart
   */
  static async getChart(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query as any;
      const result = await RevenueService.getChart({
        from: filters.from,
        to: filters.to,
        facility_id: filters.facility_id ? Number(filters.facility_id) : undefined,
        group_by: filters.group_by || 'day'
      });
      return AppResponse.success(res, result, 'Lấy dữ liệu biểu đồ doanh thu thành công', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/revenue/breakdown
   */
  static async getBreakdown(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query as any;
      const result = await RevenueService.getBreakdown({
        from: filters.from,
        to: filters.to,
        facility_id: filters.facility_id ? Number(filters.facility_id) : undefined
      });
      return AppResponse.success(res, result, 'Lấy dữ liệu phân tích doanh thu thành công', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/revenue/transactions
   */
  static async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query as any;
      const result = await RevenueService.getTransactions({
        from: filters.from,
        to: filters.to,
        facility_id: filters.facility_id ? Number(filters.facility_id) : undefined,
        source: filters.source || 'all',
        provider: filters.provider || 'all',
        page: filters.page ? Number(filters.page) : 1,
        limit: filters.limit ? Number(filters.limit) : 20,
        sortBy: filters.sortBy || 'paidAt',
        sortOrder: filters.sortOrder || 'desc'
      });
      return AppResponse.success(res, result, 'Lấy danh sách giao dịch doanh thu thành công', 200);
    } catch (error) {
      next(error);
    }
  }
}
