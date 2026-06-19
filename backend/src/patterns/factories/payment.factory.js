import { CashStrategy } from '../strategies/payment/cash.strategy.js';
import { VNPayStrategy } from '../strategies/payment/vnpay.strategy.js';
export class PaymentFactory {
    static create(type) {
        switch (type) {
            case 'cash':
                return new CashStrategy();
            case 'vnpay':
                return new VNPayStrategy();
            default:
                throw new Error('Payment not supported');
        }
    }
}
//# sourceMappingURL=payment.factory.js.map