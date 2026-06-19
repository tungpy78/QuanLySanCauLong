import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import ApiError from '../utils/ErrorClass.js';
import { TokenUtil } from '../utils/token.util.js';
import dayjs from 'dayjs';
export class AuthService {
    // --- 1. HÀM LOGIN CẬP NHẬT ---
    static async login(data, allowedRoles) {
        const { email, password } = data;
        const user = await models.User.findOne({
            where: { email },
            include: [
                {
                    model: models.StaffProfile,
                    as: 'staff_profile',
                    required: false
                }
            ]
        });
        if (!user)
            throw new ApiError('Email hoặc mật khẩu không đúng', 401);
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            throw new ApiError('Email hoặc mật khẩu không đúng', 401);
        if (!user.is_active)
            throw new ApiError('Tài khoản của bạn đã bị khóa', 403);
        if (!allowedRoles.includes(user.role)) {
            throw new ApiError('Tài khoản không có quyền truy cập hệ thống này', 403);
        }
        const accessToken = TokenUtil.generateAccessToken(user.id, user.role);
        const plainRefreshToken = TokenUtil.generateRefreshToken();
        const tokenHash = TokenUtil.hashToken(plainRefreshToken);
        await models.RefreshToken.create({
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: dayjs().add(7, 'day').toDate(),
            revoked: false
        });
        const { password_hash, ...userWithoutPassword } = user.toJSON();
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken: plainRefreshToken
        };
    }
    static async refreshAccessToken(clientRefreshToken) {
        if (!clientRefreshToken)
            throw new ApiError('Vui lòng đăng nhập', 401);
        const tokenHash = TokenUtil.hashToken(clientRefreshToken);
        const tokenRecord = await models.RefreshToken.findOne({
            where: { token_hash: tokenHash }
        });
        if (!tokenRecord)
            throw new ApiError('Refresh Token không hợp lệ', 401);
        if (tokenRecord.revoked)
            throw new ApiError('Phiên đăng nhập đã bị thu hồi. Vui lòng đăng nhập lại!', 401);
        if (dayjs().isAfter(dayjs(tokenRecord.expires_at))) {
            throw new ApiError('Phiên đăng nhập đã hết hạn', 401);
        }
        const user = await models.User.findByPk(tokenRecord.user_id);
        if (!user || !user.is_active)
            throw new ApiError('Tài khoản không tồn tại hoặc bị khóa', 401);
        const newAccessToken = TokenUtil.generateAccessToken(user.id, user.role);
        const newPlainRefreshToken = TokenUtil.generateRefreshToken();
        const newTokenHash = TokenUtil.hashToken(newPlainRefreshToken);
        await tokenRecord.destroy();
        await models.RefreshToken.create({
            user_id: user.id,
            token_hash: newTokenHash,
            expires_at: dayjs().add(7, 'day').toDate(),
            revoked: false
        });
        return { newAccessToken, newRefreshToken: newPlainRefreshToken };
    }
    static async logout(clientRefreshToken) {
        if (!clientRefreshToken)
            return;
        const tokenHash = TokenUtil.hashToken(clientRefreshToken);
        await models.RefreshToken.destroy({ where: { token_hash: tokenHash } });
    }
}
//# sourceMappingURL=auth.service.js.map