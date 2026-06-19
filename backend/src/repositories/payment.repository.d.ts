declare class PaymentRepository {
    create(data: any, transaction?: any): Promise<import("../models/payment.model.js").default>;
    findByOrderId(orderId: number, transaction?: any): Promise<import("../models/payment.model.js").default | null>;
    findPaidOrder(orderId: number, transaction?: any): Promise<import("../models/payment.model.js").default | null>;
    updateStatus(paymentId: number, data: any, transaction?: any): Promise<import("../models/payment.model.js").default | null>;
    getDefaultFacility(): Promise<import("../models/facility.model.js").default | null>;
}
export declare const paymentRepository: PaymentRepository;
export {};
//# sourceMappingURL=payment.repository.d.ts.map