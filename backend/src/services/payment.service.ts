import models from '../models/index.js';
import { VNPayUtils } from '../utils/vnpay.js';
import sequelize from '../config/database.js';
import { orderRepository } from '../repositories/order.repository.js';
import { paymentRepository } from '../repositories/payment.repository.js';
import { orderItemRepository } from '../repositories/order-item.repository.js';
import ApiError from '../utils/ErrorClass.js';
import { InventoryService } from './inventory.service.js';


export class PaymentService {
    private static async validateVNPayOrder(
        query: any
    ) {
        const isValidSignature =
            VNPayUtils.verifyIpnSignature(query);

        if (!isValidSignature) {
            return {
                RspCode: '97',
                Message: 'Checksum failed'
            };
        }

        const orderId = Number(
            query.vnp_TxnRef.replace(
                'ORDER_',
                ''
            )
        );

        const order =
            await orderRepository.findById(
                orderId
            );

        if (!order) {
            throw new ApiError(
                'Order not found',
                404
            );
        }

        const payment =
            await paymentRepository.findByOrderId(
                order.id
            );

        if (!payment) {
            throw new ApiError(
                'Payment not found',
                404
            );
        }

        if (payment.status === 'paid') {
            throw new ApiError(
                'Order already confirmed',
                400
            );
        }

        if (
            order.status !==
            'pending_payment'
        ) {
            throw new ApiError(
                'Order already processed',
                400
            );
        }

        const paidAmount =
            Number(query.vnp_Amount) / 100;

        if (
            payment.amount_cents !==
            paidAmount
        ) {
            throw new ApiError(
                'Invalid amount',
                400
            );
        }

        return {
            order,
            payment
        };
    }

    private static async completeVNPayPayment(
        data: {
            order: any;
            payment: any;
        },
        query: any
    ) {
        const t =
            await sequelize.transaction();

        try {

            const {
                order,
                payment
            } = data;

            if (
                query.vnp_ResponseCode ===
                '00'
            ) {

                await this.deductOrderInventory(
                    order.id,
                    order.facility_id,
                    t
                );

                await payment.update(
                    {
                        status: 'paid',

                        provider_ref:
                            query.vnp_TransactionNo,

                        paid_at:
                            new Date()
                    },
                    {
                        transaction: t
                    }
                );

                await order.update(
                    {
                        status:
                            'pending_pickup'
                    },
                    {
                        transaction: t
                    }
                );

            } else {

                await payment.update(
                    {
                        status: 'failed',

                        provider_ref:
                            query.vnp_TransactionNo ||
                            null
                    },
                    {
                        transaction: t
                    }
                );
            }

            await t.commit();

            return {
                RspCode: '00',
                Message: 'Confirm Success'
            };

        } catch (error) {

            await t.rollback();

            console.error(
                'POS VNPay IPN Error:',
                error
            );

            return {
                RspCode: '99',
                Message: 'Unknown error'
            };
        }
    }

    static async processVNPayIPN(vnpayQuery: any) {
        // 1. Xác thực chữ ký VNPay
        const isValidSignature = VNPayUtils.verifyIpnSignature(vnpayQuery); 
        if (!isValidSignature) {
            return { RspCode: '97', Message: 'Checksum failed' };
        }

        const vnp_TxnRef = vnpayQuery.vnp_TxnRef; 
        const vnp_ResponseCode = vnpayQuery.vnp_ResponseCode;
        const vnp_Amount = Number(vnpayQuery.vnp_Amount) / 100;
        
        // Tách lấy bookingId từ orderId (bookingId_timestamp)
        const bookingId = vnp_TxnRef.split('_')[0];

        // 2. Bắt đầu Transaction
        const t = await models.Booking.sequelize!.transaction();

        try {
            const booking = await (models.Booking as any).findByPk(bookingId, { transaction: t });
            
            // Xử lý các ngoại lệ theo chuẩn VNPay
            if (!booking) {
                await t.rollback();
                return { RspCode: '01', Message: 'Order not found' };
            }
            if (booking.payment_status === 'paid') {
                await t.rollback();
                return { RspCode: '02', Message: 'Order already confirmed' };
            }
            // KIỂM TRA BẢO MẬT: Bắt buộc giá tiền VNPay trả về phải khớp với DB
            if (booking.total_cents !== vnp_Amount) {
                await t.rollback();
                return { RspCode: '04', Message: 'Invalid amount' };
            }

            // 3. Cập nhật dữ liệu
            if (vnp_ResponseCode === '00') {
                // --- THÀNH CÔNG ---
                await booking.update({
                    payment_status: 'paid',
                    status: 'confirmed' 
                }, { transaction: t });

                await (models.Payment as any).create({
                    booking_id: booking.id,
                    provider: 'vnpay',
                    status: 'paid',
                    amount_cents: booking.total_cents,
                    provider_ref: vnpayQuery.vnp_TransactionNo,
                    paid_at: new Date() // Lưu thêm ngày giờ thanh toán
                }, { transaction: t });

                if (booking.user_id) {
                    const { UserService } = await import('./user.service.js');
                    
                    await UserService.addPointsAndUpgrade(
                        booking.user_id, 
                        booking.total_cents, 
                        t
                    );
                }

            } else {
                // --- THẤT BẠI ---
                await booking.update({
                    status: 'cancelled',
                    cancel_reason: 'Thanh toán VNPay thất bại hoặc bị hủy'
                }, { transaction: t });

                await (models.Payment as any).create({
                    booking_id: booking.id,
                    provider: 'vnpay',
                    status: 'failed',
                    amount_cents: booking.total_cents,
                    provider_ref: vnpayQuery.vnp_TransactionNo || null
                }, { transaction: t });
            }

            // Chốt giao dịch
            await t.commit();
            return { RspCode: '00', Message: 'Confirm Success' };

        } catch (error) {
            await t.rollback();
            console.error("Lỗi xử lý IPN:", error);
            return { RspCode: '99', Message: 'Unknown error' };
        }
    }

    static getVNPayReturnHtml(vnpayQuery: any): string {
        const vnp_ResponseCode = vnpayQuery.vnp_ResponseCode;

        if (vnp_ResponseCode === '00') {
            return `
                <html lang="vi">
                    <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; text-align:center;">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <h1 style="color:#16a34a; margin-top: 20px;">Thanh toán thành công!</h1>
                        <p style="color:#4b5563;">Bạn có thể đóng cửa sổ này và nhìn lên màn hình của Lễ tân.</p>
                        <script>
                            setTimeout(() => window.close(), 3000);
                        </script>
                    </body>
                </html>
            `;
        } else {
            return `
                <html lang="vi">
                    <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; text-align:center;">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        <h1 style="color:#dc2626; margin-top: 20px;">Thanh toán thất bại hoặc đã hủy!</h1>
                        <p style="color:#4b5563;">Vui lòng thử lại hoặc liên hệ Lễ tân để đổi phương thức thanh toán.</p>
                    </body>
                </html>
            `;
        }
    }

    static async payCash(
        orderId:number
    ){

        const t =
            await sequelize.transaction();

        try{

            const order =
                await orderRepository
                    .findById(
                        orderId
                    );

            if(!order){
                throw new ApiError(
                    'Không tìm thấy đơn hàng',
                    404
                );
            }

            const existedPayment =
                await paymentRepository
                    .findPaidOrder(
                        order.id,
                        t
                    );

            if(existedPayment){
                throw new ApiError(
                    'Đơn hàng đã thanh toán',
                    400
                );
            }

            await paymentRepository.create(
                {
                    order_id:
                        order.id,

                    provider:
                        'cash',

                    status:
                        'paid',

                    amount_cents:
                        order.total_cents,

                    paid_at:
                        new Date()
                },
                t
            );

            await this.deductOrderInventory(
                order.id,
                order.facility_id,
                t
            );

            await orderRepository
                .updateStatus(
                    order.id,
                    'pending_pickup'
                );

            await t.commit();

            return {
                message:
                    'Thanh toán thành công'
            };

        }catch(error){

            await t.rollback();

            throw error;
        }
    }

    static async deductOrderInventory(
        orderId:number,
        facilityId:number,
        transaction:any
    ){
        const items =
            await orderItemRepository
                .findByOrderId(
                    orderId,
                    transaction
                );

        for(const item of items){

            await InventoryService
                .adjustInventory(
                    {
                        variant_id:
                            item.variant_id,

                        facility_id:
                            facilityId,

                        qty_delta:
                            -item.quantity,

                        reason:
                            'sale',

                        ref_order_id:
                            orderId
                    },
                    {
                        transaction
                    }
                );
        }
    }

    static async processPosOrderVNPayIPN(
        query: any
    ) {
        const validationResult = await this.validateVNPayOrder(query);

        if ('RspCode' in validationResult) {
            return validationResult;
        }

        return this.completeVNPayPayment(
            validationResult,
            query
        );
    }
}