import { Op } from 'sequelize';
import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class CourtRepository extends BaseRepository<any> {
    constructor() {
        super(models.Court as any);
    }

    // Hàm đặc thù 1: Lấy danh sách sân kèm thông tin Cơ sở (Join bảng)
    async findAllWithFacility(whereCondition: any = {}, orderCondition: any = [['created_at', 'DESC']]) {
        return await this.findAll({
            where: whereCondition,
            order: orderCondition,
            include: [
                {
                    model: models.Facility,
                    as: "facility",
                    attributes: ['id', 'name', 'address']
                }
            ]
        });
    }

    // Hàm đặc thù 2: Lấy chi tiết 1 sân kèm thông tin Cơ sở
    async findByIdWithFacility(id: number, whereCondition: any = {}) {
        return await this.findOne({
            where: { id, ...whereCondition },
            include: [
                {
                    model: models.Facility,
                    as: "facility",
                    attributes: ['id', 'name', 'address']
                }
            ]
        });
    }

    // Hàm đặc thù 3: Kiểm tra trùng tên sân trong CÙNG MỘT cơ sở
    async findDuplicateNameInFacility(name: string, facilityId: number, excludeId?: number) {
        const whereCondition: any = { name, facility_id: facilityId };
        if (excludeId) {
            whereCondition.id = { [Op.ne]: excludeId };
        }
        return await this.findOne({ where: whereCondition });
    }
}

export const courtRepository = new CourtRepository();