import { Op } from "sequelize";
import models from "../models/index.js";
import { BaseRepository } from "./base.repository.js";
class FacilityRepository extends BaseRepository {
    constructor() {
        super(models.Facility);
    }
    async findByNameExcludingId(name, excludeId) {
        const whereCondition = { name };
        if (excludeId) {
            whereCondition.id = { [Op.ne]: excludeId };
        }
        return await this.findOne({ where: whereCondition });
    }
    async getTrash() {
        return await this.findAll({
            where: { deleted_at: { [Op.ne]: null } },
            paranoid: false,
            order: [['deleted_at', 'DESC']]
        });
    }
}
export const facilityRepository = new FacilityRepository();
//# sourceMappingURL=facility.repository.js.map