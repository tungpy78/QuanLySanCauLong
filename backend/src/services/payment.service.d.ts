export declare class PaymentService {
    private static validateVNPayOrder;
    private static completeVNPayPayment;
    static processVNPayIPN(vnpayQuery: any): Promise<{
        RspCode: string;
        Message: string;
    }>;
    static getVNPayReturnHtml(vnpayQuery: any): string;
    static payCash(orderId: number): Promise<{
        message: string;
    }>;
    static deductOrderInventory(orderId: number, facilityId: number, transaction: any): Promise<void>;
    static processPosOrderVNPayIPN(query: any): Promise<{
        order: any;
        payment: import("../models/payment.model.js").default;
        RspCode?: never;
        Message?: never;
    } | {
        RspCode: string;
        Message: string;
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map