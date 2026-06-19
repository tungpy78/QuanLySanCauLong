import { VNPayUtils } from '../../../utils/vnpay.js';
export class VNPayStrategy {
    async process(order) {
        return VNPayUtils
            .createPaymentUrl({
            amount: order.total_cents,
            orderId: `ORDER_${order.id}`,
            orderInfo: `Thanh toan don #${order.id}`,
            ipAddr: '127.0.0.1'
        });
    }
}
//# sourceMappingURL=vnpay.strategy.js.map