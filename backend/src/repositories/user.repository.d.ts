import { BaseRepository } from './base.repository.js';
declare class UserRepository extends BaseRepository<any> {
    constructor();
    findCustomerByPhone(phone: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    createUser(data: any, transaction?: any): Promise<any>;
    getAllUsers(search?: string): Promise<any[]>;
    toggleStatus(userId: number): Promise<any>;
    createProfile(data: any, transaction?: any): Promise<import("../models/staff_profile.model.js").default>;
}
export declare const userRepository: UserRepository;
export {};
//# sourceMappingURL=user.repository.d.ts.map