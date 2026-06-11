// repositories/order-item.repository.ts

import models from '../models/index.js';

class OrderItemRepository {

    async bulkCreate(
        items: any[],
        transaction?: any
    ) {
        return models.OrderItem.bulkCreate(
            items,
            { transaction }
        );
    }

    async findByOrderId(
        orderId: number,
        transaction?: any
    ) {
        return models.OrderItem.findAll({
            where: {
                order_id: orderId
            },
            transaction
        });
    }
}

export const orderItemRepository = new OrderItemRepository();