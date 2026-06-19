export const BOOKING_STATUS_TRANSITIONS = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['completed', 'cancelled', 'no_show'],
    'completed': [],
    'cancelled': [],
    'no_show': []
};
export const PAYMENT_STATUS_TRANSITIONS = {
    'unpaid': ['paid', 'partial'],
    'partial': ['paid'],
    'paid': ['refunded'],
    'refunded': []
};
//# sourceMappingURL=booking.constant.js.map