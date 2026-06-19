import { Model, type Optional } from 'sequelize';
export interface RefreshTokenAttributes {
    id: number;
    user_id: number;
    token_hash: string;
    expires_at: Date;
    revoked: boolean;
    created_at?: Date;
}
export interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id' | 'revoked'> {
}
declare class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
    id: number;
    user_id: number;
    token_hash: string;
    expires_at: Date;
    revoked: boolean;
    readonly created_at: Date;
}
export default RefreshToken;
//# sourceMappingURL=refresh_token.model.d.ts.map