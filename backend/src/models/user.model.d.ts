import { Model, type Optional } from 'sequelize';
export interface UserAttributes {
    id: number;
    full_name: string | null;
    email: string;
    phone: string | null;
    password_hash: string;
    avatar_url: string | null;
    role: 'admin' | 'staff' | 'customer';
    membership_type: 'standard' | 'student' | 'vip';
    loyalty_points: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'is_active' | 'loyalty_points'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    full_name: string | null;
    email: string;
    phone: string | null;
    password_hash: string;
    avatar_url: string | null;
    role: 'admin' | 'staff' | 'customer';
    membership_type: 'standard' | 'student' | 'vip';
    loyalty_points: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default User;
//# sourceMappingURL=user.model.d.ts.map