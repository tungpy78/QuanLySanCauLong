export type PaymentProvider =
    | 'cash'
    | 'vnpay';

export type PaymentStatus =
    | 'pending'
    | 'paid'
    | 'failed'
    | 'cancelled';