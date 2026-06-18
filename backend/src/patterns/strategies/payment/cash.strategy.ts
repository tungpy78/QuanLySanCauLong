import type { PaymentStrategy } from './payment.strategy.js';
import { paymentRepository } from '../../../repositories/payment.repository.js';

export class CashStrategy implements PaymentStrategy{
    async process(
        order:any,
        transaction:any
    ){
        return null;
    }
}