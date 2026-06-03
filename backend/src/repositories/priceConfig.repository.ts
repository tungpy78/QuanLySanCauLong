import { Op } from 'sequelize';
import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class PriceConfigRepository extends BaseRepository<any> {
    constructor() {
        super(models.PriceConfig as any);
    }

    // Hàm đặc thù 1: Lấy tất cả cấu hình giá kèm tên Cơ sở
    async findAllWithFacility(facilityId?: number) {
        const whereCondition = facilityId ? { facility_id: facilityId } : {};
        return await this.findAll({
            where: whereCondition,
            order: [
                ['facility_id', 'ASC'],
                ['court_type', 'ASC'],
                ['start_time', 'ASC']
            ],
            include: [
                {
                    model: models.Facility,
                    as: 'facility',
                    attributes: ['name']
                }
            ]
        });
    }

    // Hàm đặc thù 2: Kiểm tra trùng lặp khung giờ (Che giấu logic [Op] phức tạp)
    async findOverlap(facilityId: number, courtType: string, startTime: string, endTime: string, excludeId?: number) {
        const whereCondition: any = {
            facility_id: facilityId,
            court_type: courtType,
            [Op.and]: [
                { start_time: { [Op.lt]: endTime } },
                { end_time: { [Op.gt]: startTime } }
            ]
        };

        if (excludeId) {
            whereCondition.id = { [Op.ne]: excludeId };
        }

        return await this.findOne({ where: whereCondition });
    }
}

export const priceConfigRepository = new PriceConfigRepository();