import models from '../models/index.js';
import ApiError from '../utils/ErrorClass.js';
import sequelize from '../config/database.js';
import { orderRepository } from '../repositories/order.repository.js';
import { paymentRepository } from '../repositories/payment.repository.js';
import { orderItemRepository } from '../repositories/order-item.repository.js';
import { PaymentFactory } from '../patterns/factories/payment.factory.js';

export class OrderService {
    static async createOrder(
        userId: number | null,
        data: any
    ) {

        const {
            customer_name,
            customer_phone,
            shipping_address,
            payment_method,
            items,
            note,
            facility_id
        } = data;

        if (!items?.length) {
            throw new ApiError(
                'Giỏ hàng trống',
                400
            );
        }

        const t =
            await sequelize.transaction();

        try {
            // Lấy danh sách variant_id từ items để truy vấn DB
            const variantIds = items.map((item: any) => item.variant_id || item.product_variant_id);
            const variants = await models.ProductVariant.findAll({
                where: {
                    id: variantIds
                },
                transaction: t
            });

            const variantMap = new Map<number, any>(
                variants.map((v: any) => [v.id, v])
            );

            let subtotalCents = 0;
            for (const item of items) {
                const variantId = item.variant_id || item.product_variant_id;
                const variant = variantMap.get(variantId);
                if (!variant) {
                    throw new ApiError(
                        `Không tìm thấy biến thể sản phẩm có ID ${variantId}`,
                        400
                    );
                }
                subtotalCents += variant.price_cents * item.quantity;
            }

            const totalCents = subtotalCents;

            let targetFacilityId =
                facility_id;

            if (!targetFacilityId) {

                const firstFacility =
                    await models.Facility.findOne({
                        attributes: ['id']
                    });

                if (!firstFacility) {
                    throw new ApiError(
                        'Hệ thống chưa cấu hình Facility',
                        500
                    );
                }

                targetFacilityId =
                    firstFacility.id;
            }

            const order =
                await orderRepository.createOrder(
                    {
                        user_id:
                            userId,

                        facility_id:
                            targetFacilityId,

                        status:
                            'pending_payment',

                        subtotal_cents:
                            subtotalCents,

                        total_cents:
                            totalCents,

                        note:
                            `Khách: ${customer_name ||
                            'N/A'
                            } - ${customer_phone ||
                            'N/A'
                            }. Đ/c: ${shipping_address ||
                            'N/A'
                            }. ${note || ''
                            }`
                    },
                    t
                );

            const orderItems =
                items.map(
                    (item: any) => {
                        const variantId = item.variant_id || item.product_variant_id;
                        const variant = variantMap.get(variantId);
                        return {
                            order_id:
                                order.id,

                            variant_id:
                                variantId,

                            quantity:
                                item.quantity,

                            unit_price_cents:
                                variant.price_cents,

                            discount_cents:
                                0
                        };
                    }
                );

            await orderItemRepository
                .bulkCreate(
                    orderItems,
                    t
                );

            await paymentRepository
                .create(
                    {
                        provider:
                            payment_method,

                        amount_cents:
                            totalCents,

                        order_id:
                            order.id,

                        status:
                            'pending'
                    },
                    t
                );

            let paymentResult =
                null;

            if (payment_method) {

                const strategy =
                    PaymentFactory.create(
                        payment_method
                    );

                paymentResult =
                    await strategy.process(
                        order,
                        t
                    );
            }

            await t.commit();

            return {
                order,
                paymentResult
            };

        } catch (error) {

            await t.rollback();

            throw error;
        }
    }

    static async cancelOrder(
        orderId: number,
        userId: number | null
    ) {

        const order =
            await orderRepository.findOne({
                where: {
                    id: orderId,
                    ...(userId
                        ? {
                            user_id:
                                userId
                        }
                        : {})
                }
            });

        if (!order) {
            throw new ApiError(
                'Không tìm thấy đơn hàng',
                404
            );
        }

        if (
            order.status !==
            'pending_payment'
        ) {
            throw new ApiError(
                'Chỉ có thể hủy đơn hàng đang chờ xử lý',
                400
            );
        }

        await order.update({
            status: 'cancelled'
        });

        return order;
    }

    static async getAll() {
        return orderRepository.getAllFinishedOrders();
    }

    static async getById(
        id: number
    ) {

        const order =
            await orderRepository
                .getByIdDetail(id);

        if (!order) {
            throw new ApiError(
                'Không tìm thấy đơn hàng',
                404
            );
        }

        return order;
    }

    static async getMyOrders(
        userId: number
    ) {

        return orderRepository
            .getMyOrders(userId);
    }

    static async getPendingPickupOrders() {

        return orderRepository
            .getByStatus(
                'pending_pickup'
            );
    }

    static async getPendingPaymentOrders() {

        return orderRepository
            .getByStatus(
                'pending_payment'
            );
    }

    static async completeOrder(
        orderId: number
    ) {

        const order =
            await orderRepository.findById(
                orderId
            );

        if (!order) {
            throw new ApiError(
                'Không tìm thấy đơn hàng',
                404
            );
        }

        if (
            order.status !==
            'pending_pickup'
        ) {
            throw new ApiError(
                'Đơn chưa sẵn sàng giao',
                400
            );
        }

        await orderRepository.updateStatus(
            orderId,
            'completed'
        );

        return {
            message:
                'Hoàn thành đơn hàng'
        };
    }

    static async confirmOrder(
        orderId: number
    ) {

        const order =
            await orderRepository.findById(
                orderId
            );

        if (!order) {
            throw new ApiError(
                'Không tìm thấy đơn hàng',
                404
            );
        }

        if (
            order.status !==
            'pending_payment'
        ) {
            throw new ApiError(
                'Trạng thái đơn không hợp lệ',
                400
            );
        }

        await orderRepository.updateStatus(
            orderId,
            'pending_pickup'
        );

        return {
            message:
                'Xác nhận đơn hàng thành công'
        };
    }
}