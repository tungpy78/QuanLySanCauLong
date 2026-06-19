import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';
class BookingRepository extends BaseRepository {
    constructor() {
        super(models.Booking);
    }
    // Hàm đặc thù: Lấy danh sách booking kèm thông tin User, Facility, Court
    async findAllWithDetails(whereCondition = {}) {
        return await this.findAll({
            where: whereCondition,
            include: [
                { model: models.User, as: 'user', attributes: ['id', 'email', 'phone', 'full_name'] },
                { model: models.Facility, as: 'facility', attributes: ['name'] },
                {
                    model: models.BookingSlot, as: 'slots',
                    include: [{ model: models.Court, as: 'court', attributes: ['name'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }
    async findByIdWithDetails(id) {
        return await this.findOne({
            where: { id },
            include: [
                { model: models.User, as: 'user', attributes: ['id', 'full_name', 'phone', 'email'] },
                { model: models.Facility, as: 'facility', attributes: ['id', 'name'] },
                {
                    model: models.BookingSlot, as: 'slots', attributes: ['id', 'court_id', 'start_at', 'end_at', 'price_cents'],
                    include: [{ model: models.Court, as: 'court', attributes: ['id', 'name'] }]
                }
            ]
        });
    }
}
export const bookingRepository = new BookingRepository();
//# sourceMappingURL=booking.repository.js.map