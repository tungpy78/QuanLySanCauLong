import { PaymentService } from '../../services/payment.service.js';
import type { Request, Response, NextFunction } from "express";
import AppResponse from '../../utils/AppResponse.js';

export class PaymentController {

    // API Hứng Webhook từ VNPay
    static async vnpayIpn(req: Request, res: Response, next: NextFunction) {
        try {
            const vnpayQuery = req.query; 
            const vnp_TxnRef = vnpayQuery.vnp_TxnRef as string;

            let result;
            if (vnp_TxnRef && vnp_TxnRef.startsWith('ORDER_')) {
                result = await PaymentService.processPosOrderVNPayIPN(vnpayQuery);
            } else {
                result = await PaymentService.processVNPayIPN(vnpayQuery);
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("IPN Error:", error);
            // Nếu lỗi nội bộ server, báo lỗi 99 cho VNPay
            return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
        }
    }

    static async vnpayReturn(req: Request, res: Response, next: NextFunction) {
        try {
            const vnpayQuery = req.query;
            const vnp_TxnRef = vnpayQuery.vnp_TxnRef as string;

            // Cập nhật trạng thái thanh toán trong database
            try {
                if (vnp_TxnRef && vnp_TxnRef.startsWith('ORDER_')) {
                    await PaymentService.processPosOrderVNPayIPN(vnpayQuery);
                } else {
                    await PaymentService.processVNPayIPN(vnpayQuery);
                }
            } catch (err) {
                // Bỏ qua lỗi nếu đã được xử lý bởi IPN trước đó
                console.log("Return URL processing message (already handled or failed):", err);
            }

            // Gọi Service để lấy chuỗi HTML
            const htmlContent = PaymentService.getVNPayReturnHtml(vnpayQuery);
            
            // Trả thẳng HTML về cho trình duyệt
            return res.send(htmlContent);
        } catch (error) {
            next(error);
        }
    }

    static async posOrderVNPayIpn(
        req: Request,
        res: Response
    ) {
        const result =
            await PaymentService.processPosOrderVNPayIPN(
                req.query
            );

        return res.status(200).json(
            result
        );
    }

    static async payCash( req: Request, res: Response, next: NextFunction ) {
        try {
            const orderId = Number(req.params.id);
            const data = await PaymentService.payCash(orderId);
            return AppResponse.success(res, data, 'Thanh toán tiền mặt thành công');
        } catch (err) {
            next(err);
        }
    }
}