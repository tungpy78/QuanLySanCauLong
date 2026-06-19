/**
 * Tiện ích hỗ trợ tích hợp cổng thanh toán VNPay
 */
export declare class VNPayUtils {
    private static tmnCode;
    private static hashSecret;
    private static vnpUrl;
    private static returnUrl;
    /**
     * Tạo URL thanh toán VNPay
     */
    static createPaymentUrl(params: {
        amount: number;
        orderId: string;
        orderInfo: string;
        ipAddr: string;
        createDate?: string;
    }): string;
    /**
     * Kiểm tra tính hợp lệ của dữ liệu phản hồi từ VNPay (Checksum)
     */
    static verifyIpnSignature(vnpayParams: any): boolean;
    private static sortObject;
}
//# sourceMappingURL=vnpay.d.ts.map