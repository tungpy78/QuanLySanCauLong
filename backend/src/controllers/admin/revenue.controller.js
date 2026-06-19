import { RevenueService } from '../../services/revenue.service.js';
import AppResponse from '../../utils/AppResponse.js';
export class RevenueController {
    /**
     * GET /api/v1/admin/revenue/summary
     */
    static async getSummary(req, res, next) {
        try {
            const query = req.query;
            const from = typeof query.from === 'string' ? query.from : undefined;
            const to = typeof query.to === 'string' ? query.to : undefined;
            const facility_id = typeof query.facility_id === 'string' ? Number(query.facility_id) : undefined;
            const serviceParams = {};
            if (from !== undefined)
                serviceParams.from = from;
            if (to !== undefined)
                serviceParams.to = to;
            if (facility_id !== undefined && !isNaN(facility_id))
                serviceParams.facility_id = facility_id;
            const result = await RevenueService.getSummary(serviceParams);
            return AppResponse.success(res, result, 'Lấy thông tin tổng quan doanh thu thành công', 200);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/admin/revenue/chart
     */
    static async getChart(req, res, next) {
        try {
            const query = req.query;
            const from = typeof query.from === 'string' ? query.from : undefined;
            const to = typeof query.to === 'string' ? query.to : undefined;
            const facility_id = typeof query.facility_id === 'string' ? Number(query.facility_id) : undefined;
            const group_by = typeof query.group_by === 'string' ? query.group_by : undefined;
            const serviceParams = {
                group_by: group_by ?? 'day',
            };
            if (from !== undefined)
                serviceParams.from = from;
            if (to !== undefined)
                serviceParams.to = to;
            if (facility_id !== undefined && !isNaN(facility_id))
                serviceParams.facility_id = facility_id;
            const result = await RevenueService.getChart(serviceParams);
            return AppResponse.success(res, result, 'Lấy dữ liệu biểu đồ doanh thu thành công', 200);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/admin/revenue/breakdown
     */
    static async getBreakdown(req, res, next) {
        try {
            const query = req.query;
            const from = typeof query.from === 'string' ? query.from : undefined;
            const to = typeof query.to === 'string' ? query.to : undefined;
            const facility_id = typeof query.facility_id === 'string' ? Number(query.facility_id) : undefined;
            const serviceParams = {};
            if (from !== undefined)
                serviceParams.from = from;
            if (to !== undefined)
                serviceParams.to = to;
            if (facility_id !== undefined && !isNaN(facility_id))
                serviceParams.facility_id = facility_id;
            const result = await RevenueService.getBreakdown(serviceParams);
            return AppResponse.success(res, result, 'Lấy dữ liệu phân tích doanh thu thành công', 200);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/admin/revenue/transactions
     */
    static async getTransactions(req, res, next) {
        try {
            const query = req.query;
            const from = typeof query.from === 'string' ? query.from : undefined;
            const to = typeof query.to === 'string' ? query.to : undefined;
            const facility_id = typeof query.facility_id === 'string' ? Number(query.facility_id) : undefined;
            const source = typeof query.source === 'string' ? query.source : undefined;
            const provider = typeof query.provider === 'string' ? query.provider : undefined;
            const page = typeof query.page === 'string' ? Number(query.page) : undefined;
            const limit = typeof query.limit === 'string' ? Number(query.limit) : undefined;
            const sortBy = typeof query.sortBy === 'string' ? query.sortBy : undefined;
            const sortOrder = typeof query.sortOrder === 'string' ? query.sortOrder : undefined;
            const serviceParams = {
                source: source ?? 'all',
                provider: provider ?? 'all',
                page: page ?? 1,
                limit: limit ?? 20,
                sortBy: sortBy ?? 'paidAt',
                sortOrder: sortOrder ?? 'desc',
            };
            if (from !== undefined)
                serviceParams.from = from;
            if (to !== undefined)
                serviceParams.to = to;
            if (facility_id !== undefined && !isNaN(facility_id))
                serviceParams.facility_id = facility_id;
            const result = await RevenueService.getTransactions(serviceParams);
            return AppResponse.success(res, result, 'Lấy danh sách giao dịch doanh thu thành công', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=revenue.controller.js.map