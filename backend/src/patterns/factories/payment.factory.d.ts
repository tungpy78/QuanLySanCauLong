import { CashStrategy } from '../strategies/payment/cash.strategy.js';
import { VNPayStrategy } from '../strategies/payment/vnpay.strategy.js';
export declare class PaymentFactory {
    static create(type: string): CashStrategy | VNPayStrategy;
}
//# sourceMappingURL=payment.factory.d.ts.map