import { Op } from "sequelize";
import Facility from "../models/facility.model.js";
import models from "../models/index.js";
import ApiError from "../utils/ErrorClass.js";
import type { CreateFacilityInput, updateFacilityInput } from "../validations/facility.validation.js";
import { facilityRepository } from "../repositories/facility.repository.js";

export class FacilityService {
    static async getAllFacilities() {
        return await facilityRepository.findAll({
            where: { is_active: true },
            order: [['created_at', 'DESC']]
        })
    }

    static async getAllFacilitiesForAdmin() {
        return await facilityRepository.findAll({
            order: [['created_at', 'DESC']]
        })
    }

    static async getFacilityById(id: number) {
        const facility = await facilityRepository.findOne({
            where: { id: id,  is_active: true}
        })
        if(!facility){
            throw new ApiError("Không tìm thấy cơ sở này", 404);
        }

        return facility;
    }

    static async getFacilityByIdForAdmin(id: number) {
        const facility = await facilityRepository.findById(id);
        if(!facility){
            throw new ApiError("Không tìm thấy cơ sở này", 404);
        }

        return facility;
    }


    static async getFacilityWithCourts(id: number) {
        const facility = await this.getFacilityById(id);
        
        const courts = await (models.Court as any).findAll({
            where: { facility_id: id, is_active: true } 
        });

        return {
            ...facility.toJSON(),
            courts
        };
    }

    static async createFacility(data: CreateFacilityInput) {
        const existingFacility = await facilityRepository.findByNameExcludingId(data.name);
        if (existingFacility) {
            if (!existingFacility.is_active) {
                await facilityRepository.update(existingFacility.id ,{ ...data, is_active: true });
                return existingFacility;
            }
            throw new ApiError('Tên cơ sở này đã tồn tại trong hệ thống', 400);
        }

        return await facilityRepository.create(data);
    }

    static async updateFacility(id: number, data: updateFacilityInput) {
        const facility =  await this.getFacilityByIdForAdmin(id);
        
        if (data.name && data.name !== facility.name) {
            const duplicateName = await facilityRepository.findByNameExcludingId(data.name, id);

            if (duplicateName) {
                throw new ApiError('Tên này đã bị trùng với một cơ sở khác', 400);
            }
        }
        return await facilityRepository.update(id, data);
    }

    static async deleteFacility(id: number) {
        const facility = await this.getFacilityByIdForAdmin(id);    

        await facilityRepository.destroy(id);
        
        return { message: 'Đã xóa (mềm) cơ sở thành công' };
    }

    static async restoreFacility(id: number) {
        const isRestored = await facilityRepository.restore(id);

        if (!isRestored) {
            throw new ApiError('Không tìm thấy cơ sở trong thùng rác', 404);
        }
        return { message: 'Đã khôi phục cơ sở thành công' };
    }

    static async getDeletedFacilities() {
        return await facilityRepository.getTrash();
    }
}