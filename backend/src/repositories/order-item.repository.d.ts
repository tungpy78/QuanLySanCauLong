declare class OrderItemRepository {
    bulkCreate(items: any[], transaction?: any): Promise<import("../models/order_item.model.js").default[]>;
    findByOrderId(orderId: number, transaction?: any): Promise<import("../models/order_item.model.js").default[]>;
}
export declare const orderItemRepository: OrderItemRepository;
export {};
//# sourceMappingURL=order-item.repository.d.ts.map