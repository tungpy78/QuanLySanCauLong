import { Op } from "sequelize";
import models from "../models/index.js";
import ApiError from "../utils/ErrorClass.js";
import { courtRepository } from "../repositories/court.repository.js";
export class CourtService {
    static async getAllCourts() {
        return await courtRepository.findAllWithFacility({ is_active: true });
    }
    static async getAllCourtsByAdmin() {
        return await courtRepository.findAllWithFacility({});
    }
    static async getCourtById(id) {
        const court = await courtRepository.findByIdWithFacility(id, { is_active: true });
        if (!court) {
            throw new ApiError("Không tìm thấy sân này", 404);
        }
        return court;
    }
    static async getCourtByIdByAdmin(id) {
        const court = await courtRepository.findByIdWithFacility(id);
        if (!court) {
            throw new ApiError("Không tìm thấy sân này", 404);
        }
        return court;
    }
    static async createCourt(data) {
        const facility = await courtRepository.findOne({
            where: { id: data.facility_id, is_active: true }
        });
        if (!facility)
            throw new ApiError("Cơ sở này không tồn tại hoặc đã ngừng hoạt động", 404);
        const existingCourt = await courtRepository.findDuplicateNameInFacility(data.name, data.facility_id);
        if (existingCourt) {
            if (existingCourt.is_active) {
                await courtRepository.update(existingCourt, { ...data, is_active: true });
                return existingCourt;
            }
            throw new ApiError(`Tên sân '${data.name}' đã tồn tại trong cơ sở này`, 400);
        }
        return await courtRepository.create(data);
    }
    static async updateCourt(id, data) {
        const court = await this.getCourtByIdByAdmin(id);
        if (data.facility_id && data.facility_id !== court.facility_id) {
            const newFacility = await courtRepository.findOne({
                where: { id: data.facility_id, is_active: true }
            });
            if (!newFacility)
                throw new ApiError("Cơ sở mới không tồn tại", 404);
        }
        if (data.name) {
            const checkFacilityId = data.facility_id || court.facility_id;
            const duplicateName = await courtRepository.findDuplicateNameInFacility(data.name, checkFacilityId, id);
            if (duplicateName)
                throw new ApiError("Tên sân đã bị trùng trong cơ sở này", 400);
        }
        return await courtRepository.update(id, data);
    }
    static async deleteCourt(id) {
        await this.getCourtByIdByAdmin(id);
        await courtRepository.destroy(id);
        return { message: 'Đã xóa (mềm) sân thành công' };
    }
}
//# sourceMappingURL=court.service.js.map