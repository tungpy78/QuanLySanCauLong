import { Op } from 'sequelize';
import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';
class OrderRepository extends BaseRepository {
    constructor() {
        super(models.Order);
    }
    async createOrder(data, transaction) {
        return this.create(data, { transaction });
    }
    async getMyOrders(userId) {
        return this.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: models.Payment,
                    as: 'payments'
                },
                {
                    model: models.OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: models.ProductVariant,
                            as: 'variant',
                            include: [
                                {
                                    model: models.Product,
                                    as: 'product'
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [
                ['created_at', 'DESC']
            ]
        });
    }
    async getByIdDetail(id) {
        return this.findOne({
            where: { id },
            include: [
                {
                    model: models.OrderItem,
                    as: 'items'
                }
            ]
        });
    }
    async getByStatus(status) {
        return this.findAll({
            where: { status },
            include: [
                {
                    model: models.OrderItem,
                    as: 'items'
                }
            ]
        });
    }
    async updateStatus(orderId, status) {
        const order = await this.findById(orderId);
        if (!order) {
            return null;
        }
        await order.update({
            status
        });
        return order;
    }
    async getAllFinishedOrders() {
        return this.findAll({
            where: {
                status: {
                    [Op.in]: [
                        'completed',
                        'cancelled',
                        'refunded',
                        'expired'
                    ]
                }
            },
            include: [
                {
                    model: models.OrderItem,
                    as: 'items'
                }
            ],
            order: [
                ['created_at', 'DESC']
            ]
        });
    }
    async findUserOrder(orderId, userId) {
        return this.findOne({
            where: {
                id: orderId,
                ...(userId
                    ? { user_id: userId }
                    : {})
            }
        });
    }
    async getDefaultFacility() {
        return models.Facility.findOne({
            attributes: ['id']
        });
    }
    async findByIdWithTransaction(id, transaction) {
        return models.Order.findByPk(id, { transaction });
    }
}
export const orderRepository = new OrderRepository();
//# sourceMappingURL=order.repository.js.map