// repositories/payment.repository.ts

import models from '../models/index.js';

class PaymentRepository {
    async create(
        data: any,
        transaction?: any
    ) {
        return models.Payment.create(
            data,
            { transaction }
        );
    }

    async findByOrderId(
        orderId: number,
        transaction?: any
    ) {
        return models.Payment.findOne({
            where: {
                order_id: orderId
            },
            transaction
        });
    }

    async findPaidOrder(
        orderId: number,
        transaction?: any
    ) {
        return models.Payment.findOne({
            where: {
                order_id: orderId,
                status: 'paid'
            },
            transaction
        });
    }

    async updateStatus(
        paymentId: number,
        data: any,
        transaction?: any
    ) {
        const payment =
            await models.Payment.findByPk(
                paymentId,
                { transaction }
            );

        if (!payment) {
            return null;
        }

        return payment.update(
            data,
            { transaction }
        );
    }

    async getDefaultFacility() {
        return models.Facility.findOne({
            attributes: ['id']
        });
    }
}

export const paymentRepository = new PaymentRepository();