import { Op } from "sequelize";
import models from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

class FacilityRepository extends BaseRepository<any> {
    constructor() {
        super(models.Facility as any)
    }

    async findByNameExcludingId(name: string, excludeId?: number) {
        const whereCondition: any = {name};
        if(excludeId) {
            whereCondition.id = { [Op.ne]: excludeId };
        }
        return await this.findOne({where: whereCondition})
    }

    async getTrash() {
        return await this.findAll({
            where: {delete_at: { [Op.ne]: null as any }},
            paranoid: false,
            order: [['delete_at', 'DESC']]
        });
    }
}
export const facilityRepository = new FacilityRepository();