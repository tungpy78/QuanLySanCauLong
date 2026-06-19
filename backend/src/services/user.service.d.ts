import type { CreateStaffDto } from '../validations/user.validation.js';
import type { Transaction } from 'sequelize';
export declare class UserService {
    static getUserByPhone(phone: string): Promise<any>;
    static createGuestUser(phone: string, fullName: string, membershipType?: string): Promise<any>;
    static addPointsAndUpgrade(userId: number, amountPaid: number, t: Transaction): Promise<void>;
    static createStaff(staffData: CreateStaffDto): Promise<any>;
    static getAllUsers(search?: string): Promise<any[]>;
    static toggleUserStatus(userId: number): Promise<any>;
}
//# sourceMappingURL=user.service.d.ts.map