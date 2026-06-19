import { Op } from 'sequelize';
import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';
class UserRepository extends BaseRepository {
    constructor() {
        super(models.User);
    }
    // Hàm đặc thù: Tìm khách hàng (customer) bằng số điện thoại
    async findCustomerByPhone(phone) {
        return await this.findOne({
            where: { phone, role: 'customer' }
        });
    }
    async findByEmail(email) {
        return this.findOne({
            where: { email }
        });
    }
    async createUser(data, transaction) {
        return this.create(data, { transaction });
    }
    async getAllUsers(search) {
        const where = {};
        if (search) {
            where[Op.or] = [
                {
                    full_name: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    email: {
                        [Op.like]: `%${search}%`
                    }
                }
            ];
        }
        return this.findAll({
            where,
            attributes: {
                exclude: ['password_hash']
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }
    async toggleStatus(userId) {
        const user = await this.findById(userId);
        if (!user) {
            return null;
        }
        await user.update({
            is_active: !user.is_active
        });
        return user;
    }
    async createProfile(data, transaction) {
        return models.StaffProfile.create(data, { transaction });
    }
}
export const userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map