import AppResponse from '../utils/AppResponse.js';
const errorHandlingMiddleware = (err, req, res, next) => {
    console.error("🔥 ERROR LOG:", err);
    let message = err.message || 'Lỗi hệ thống máy chủ';
    let statusCode = err.statusCode || 500;
    if (err.name === 'JsonWebTokenError') {
        message = 'Token không hợp lệ';
        statusCode = 401;
    }
    return AppResponse.error(res, message, statusCode);
};
export default errorHandlingMiddleware;
//# sourceMappingURL=errorHandler.middleware.js.map