/**
 * Class này giúp chuẩn hóa dữ liệu trả về cho Frontend
 * Format chung: { success: boolean, message: string, data: any, statusCode: number }
 */
class AppResponse {
    // 1. Phản hồi Thành công (Mặc định 200 OK)
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            statusCode: statusCode,
            message: message,
            data: data,
        });
    }
    // 2. Phản hồi Lỗi (Mặc định 500 Internal Server Error)
    static error(res, message = 'Internal Server Error', statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            statusCode: statusCode,
            message: message,
            data: null, // Lỗi thì không có data
        });
    }
}
export default AppResponse;
//# sourceMappingURL=AppResponse.js.map