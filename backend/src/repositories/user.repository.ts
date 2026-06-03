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
}

export const userRepository = new UserRepository();