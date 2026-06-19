// repositories/order-item.repository.ts
import models from '../models/index.js';
class OrderItemRepository {
    async bulkCreate(items, transaction) {
        return models.OrderItem.bulkCreate(items, { transaction });
    }
    async findByOrderId(orderId, transaction) {
        return models.OrderItem.findAll({
            where: {
                order_id: orderId
            },
            transaction
        });
    }
}
export const orderItemRepository = new OrderItemRepository();
//# sourceMappingURL=order-item.repository.js.map