import { AuthService } from '../../services/auth.service.js';
// Cấu hình chuẩn bảo mật Cookie
const COOKIE_OPTIONS = {
    httpOnly: true, // Chống XSS
    secure: process.env.NODE_ENV === 'production', // true nếu chạy HTTPS
    sameSite: 'strict', // Chống CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
};
export class AdminAuthController {
    static async login(req, res, next) {
        try {
            const result = await AuthService.login(req.body, ['admin', 'staff']);
            res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
            res.status(200).json({
                success: true,
                message: 'Đăng nhập trang quản trị thành công',
                data: {
                    user: result.user,
                    token: result.accessToken
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const clientRefreshToken = req.cookies.refreshToken;
            const result = await AuthService.refreshAccessToken(clientRefreshToken);
            res.cookie('refreshToken', result.newRefreshToken, COOKIE_OPTIONS);
            res.status(200).json({
                success: true,
                message: 'Cấp lại Access Token thành công',
                data: { token: result.newAccessToken }
            });
        }
        catch (error) {
            res.clearCookie('refreshToken');
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const clientRefreshToken = req.cookies.refreshToken;
            await AuthService.logout(clientRefreshToken);
            res.clearCookie('refreshToken');
            res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map