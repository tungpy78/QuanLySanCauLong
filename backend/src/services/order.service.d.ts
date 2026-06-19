export declare class OrderService {
    static createOrder(userId: number | null, data: any): Promise<{
        order: any;
        paymentResult: string | null;
    }>;
    static cancelOrder(orderId: number, userId: number | null): Promise<any>;
    static getAll(): Promise<any[]>;
    static getById(id: number): Promise<any>;
    static getMyOrders(userId: number): Promise<any[]>;
    static getPendingPickupOrders(): Promise<any[]>;
    static getPendingPaymentOrders(): Promise<any[]>;
    static completeOrder(orderId: number): Promise<{
        message: string;
    }>;
    static confirmOrder(orderId: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=order.service.d.ts.map