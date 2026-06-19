import { Op } from "sequelize";
import Court from "../models/court.model.js";
import models from "../models/index.js";
import ApiError from "../utils/ErrorClass.js";
import { priceConfigRepository } from "../repositories/priceConfig.repository.js";
import { courtRepository } from "../repositories/court.repository.js";
export class PriceConfigService {
    static async getAllConfigs(facilityId) {
        return await priceConfigRepository.findAllWithFacility(facilityId);
    }
    static async checkTimeOverlap(facilityId, courtType, startTime, endTime, excludeId) {
        const court = await courtRepository.findOne({
            where: {
                facility_id: facilityId,
                court_type: courtType,
                is_active: true
            }
        });
        if (!court) {
            throw new ApiError('Cơ sở này không tồn tại hoặc không kinh doanh loại sân này', 404);
        }
        const overlap = await priceConfigRepository.findOverlap(facilityId, courtType, startTime, endTime, excludeId);
        if (overlap) {
            throw new ApiError(`Khung giờ này bị trùng lặp với một cấu hình giá hiện có (${overlap.start_time} - ${overlap.end_time}) của loại sân ${courtType}`, 400);
        }
    }
    static async createConfig(data) {
        await this.checkTimeOverlap(data.facility_id, data.court_type, data.start_time, data.end_time);
        return await priceConfigRepository.create(data);
    }
    static async updateConfig(id, data) {
        const config = await priceConfigRepository.findById(id);
        if (!config)
            throw new ApiError('Không tìm thấy cấu hình giá này', 404);
        const checkFacilityId = data.facility_id || config.facility_id;
        const checkCourtType = data.court_type || config.court_type;
        const checkStartTime = data.start_time || config.start_time;
        const checkEndTime = data.end_time || config.end_time;
        await this.checkTimeOverlap(checkFacilityId, checkCourtType, checkStartTime, checkEndTime, id);
        return await priceConfigRepository.update(id, data);
    }
    static async deleteConfig(id) {
        const config = await priceConfigRepository.findById(id);
        if (!config)
            throw new ApiError('Không tìm thấy cấu hình giá này', 404);
        await priceConfigRepository.destroy(id);
        return { message: 'Đã xóa cấu hình giá thành công' };
    }
}
//# sourceMappingURL=priceConfig.service.js.map