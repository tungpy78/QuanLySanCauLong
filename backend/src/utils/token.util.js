import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export class TokenUtil {
    static generateAccessToken(userId, role) {
        return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '15m' });
    }
    static generateRefreshToken() {
        return crypto.randomBytes(40).toString('hex');
    }
    static hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}
//# sourceMappingURL=token.util.js.map