import type { PaymentStrategy } from './payment.strategy.js';
import { VNPayUtils } from '../../../utils/vnpay.js';

export class VNPayStrategy implements PaymentStrategy {
    async process(
        order:any
    ){
        return VNPayUtils
            .createPaymentUrl({
                amount:
                    order.total_cents,

                orderId:
                    `ORDER_${order.id}`,

                orderInfo:
                    `Thanh toan don #${order.id}`,

                ipAddr:
                    '127.0.0.1'
            });
    }
}