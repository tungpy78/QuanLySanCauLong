import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class RefreshToken extends Model {
}
RefreshToken.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});
export default RefreshToken;
//# sourceMappingURL=refresh_token.model.js.map