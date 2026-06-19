import models from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
class RevenueRepository {
    /**
     * Lấy thông tin Facility theo ID
     */
    async getFacilityById(id) {
        return await models.Facility.findByPk(id, {
            attributes: ['id', 'name']
        });
    }
    /**
     * Lấy toàn bộ payments có status = 'paid' phục vụ tính toán summary, chart, breakdown
     */
    async getPaymentsForRevenue(filters) {
        const { from, to, facilityId } = filters;
        const whereClause = {
            status: 'paid',
            [Op.and]: [
                sequelize.where(sequelize.fn('COALESCE', sequelize.col('Payment.paid_at'), sequelize.col('Payment.created_at')), {
                    [Op.between]: [from, to]
                })
            ]
        };
        if (facilityId) {
            whereClause[Op.or] = [
                { '$booking.facility_id$': facilityId },
                { '$order.facility_id$': facilityId }
            ];
        }
        return await models.Payment.findAll({
            where: whereClause,
            include: [
                {
                    model: models.Booking,
                    as: 'booking',
                    attributes: ['id', 'facility_id'],
                    required: false
                },
                {
                    model: models.Order,
                    as: 'order',
                    attributes: ['id', 'facility_id'],
                    required: false
                }
            ]
        });
    }
    /**
     * Lấy danh sách giao dịch phân trang, filter và sort
     */
    async getTransactions(filters) {
        const { from, to, facilityId, source, provider, limit, offset, sortBy, sortOrder } = filters;
        const whereClause = {
            status: 'paid',
            [Op.and]: [
                sequelize.where(sequelize.fn('COALESCE', sequelize.col('Payment.paid_at'), sequelize.col('Payment.created_at')), {
                    [Op.between]: [from, to]
                })
            ]
        };
        // Lọc theo provider (cash / vnpay)
        if (provider !== 'all') {
            whereClause.provider = provider;
        }
        // Lọc theo source (booking / order)
        if (source === 'booking') {
            whereClause.booking_id = { [Op.ne]: null };
        }
        else if (source === 'order') {
            whereClause.order_id = { [Op.ne]: null };
        }
        // Lọc theo cơ sở
        if (facilityId) {
            whereClause[Op.or] = [
                { '$booking.facility_id$': facilityId },
                { '$order.facility_id$': facilityId }
            ];
        }
        // Xác định trường sort
        let orderExpr = [];
        if (sortBy === 'amount') {
            orderExpr = [['amount_cents', sortOrder]];
        }
        else {
            // Mặc định sortBy === 'paidAt'
            // Sắp xếp theo COALESCE(paid_at, created_at)
            orderExpr = [
                [sequelize.fn('COALESCE', sequelize.col('Payment.paid_at'), sequelize.col('Payment.created_at')), sortOrder]
            ];
        }
        return await models.Payment.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: models.Booking,
                    as: 'booking',
                    attributes: ['id', 'facility_id', 'user_id'],
                    include: [
                        { model: models.Facility, as: 'facility', attributes: ['name'] },
                        { model: models.User, as: 'user', attributes: ['full_name'] }
                    ],
                    required: false
                },
                {
                    model: models.Order,
                    as: 'order',
                    attributes: ['id', 'facility_id', 'user_id'],
                    include: [
                        { model: models.Facility, as: 'facility', attributes: ['name'] },
                        { model: models.User, as: 'user', attributes: ['full_name'] }
                    ],
                    required: false
                }
            ],
            limit,
            offset,
            order: orderExpr
        });
    }
}
export const revenueRepository = new RevenueRepository();
//# sourceMappingURL=revenue.repository.js.map