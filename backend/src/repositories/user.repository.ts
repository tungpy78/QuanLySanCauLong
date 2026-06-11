import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class UserRepository extends BaseRepository<any> {
    constructor() {
        super(models.User);
    }

    // Hàm đặc thù: Tìm khách hàng (customer) bằng số điện thoại
    async findCustomerByPhone(phone: string) {
        return await this.findOne({
            where: { phone, role: 'customer' }
        });
    }

    async findByEmail(email: string) {
        return this.findOne({
            where: { email }
        });
    }

    async createUser(
        data: any,
        transaction?: any
    ) {
        return this.create(
            data,
            { transaction }
        );
    }

    async getAllUsers() {
        return this.findAll({
            attributes: {
                exclude: ['password_hash']
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    async toggleStatus(userId: number) {
        const user =
            await this.findById(userId);

        if (!user) {
            return null;
        }

        await user.update({
            is_active:
                !user.is_active
        });

        return user;
    }

    async createProfile(
        data: any,
        transaction?: any
    ) {
        return models.StaffProfile.create(
            data,
            { transaction }
        );
    }
}

export const userRepository = new UserRepository();