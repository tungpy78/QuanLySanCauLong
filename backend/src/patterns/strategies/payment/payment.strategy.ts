export interface PaymentStrategy {
    process(
        order: any,
        transaction: any
    ): Promise<any>;
}