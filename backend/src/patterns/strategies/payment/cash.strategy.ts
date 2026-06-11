import type { PaymentStrategy } from './payment.strategy.js';
import { paymentRepository } from '../../../repositories/payment.repository.js';

export class CashStrategy implements PaymentStrategy{
    async process(
        order:any,
        transaction:any
    ){

        await paymentRepository.create(
            {
                order_id: order.id,
                provider: 'cash',
                status: 'paid',
                amount_cents:
                    order.total_cents
            },
            transaction
        );

        return null;
    }
}