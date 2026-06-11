import { Op } from 'sequelize';
import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class OrderRepository extends BaseRepository<any> {
    constructor() {
        super(models.Order as any);
    }

    async createOrder(
        data: any,
        transaction?: any
    ) {
        return this.create(
            data,
            { transaction }
        );
    }

    async getMyOrders(userId: number) {
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

    async getByIdDetail(id: number) {
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

    async getByStatus(status: string) {
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

    async updateStatus(
        orderId: number,
        status: string
    ) {

        const order =
            await this.findById(
                orderId
            );

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

    async findUserOrder(
        orderId: number,
        userId?: number | null
    ) {

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

    async findByIdWithTransaction(
        id:number,
        transaction?:any
    ){
        return models.Order.findByPk(
            id,
            { transaction }
        );
    }
}

export const orderRepository = new OrderRepository();