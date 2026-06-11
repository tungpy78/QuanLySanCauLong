export type OrderStatus =
    | 'pending_payment'
    | 'pending_pickup'
    | 'completed'
    | 'cancelled'
    | 'expired'
    | 'refunded';

export type PickupType =
    | 'immediate'
    | 'pickup_store';