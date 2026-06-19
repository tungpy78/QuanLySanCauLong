import AppResponse from '../utils/AppResponse.js';
export const requireRoles = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return AppResponse.error(res, 'Bạn không có quyền truy cập chức năng này', 403);
        }
        next();
    };
};
//# sourceMappingURL=role.middleware.js.map