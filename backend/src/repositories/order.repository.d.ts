import { BaseRepository } from './base.repository.js';
declare class OrderRepository extends BaseRepository<any> {
    constructor();
    createOrder(data: any, transaction?: any): Promise<any>;
    getMyOrders(userId: number): Promise<any[]>;
    getByIdDetail(id: number): Promise<any>;
    getByStatus(status: string): Promise<any[]>;
    updateStatus(orderId: number, status: string): Promise<any>;
    getAllFinishedOrders(): Promise<any[]>;
    findUserOrder(orderId: number, userId?: number | null): Promise<any>;
    getDefaultFacility(): Promise<import("../models/facility.model.js").default | null>;
    findByIdWithTransaction(id: number, transaction?: any): Promise<import("../models/order.model.js").default | null>;
}
export declare const orderRepository: OrderRepository;
export {};
//# sourceMappingURL=order.repository.d.ts.map