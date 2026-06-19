import { FacilityService } from "../../services/facility.service.js";
import AppResponse from "../../utils/AppResponse.js";
export class FacilityController {
    static async getAll(req, res, next) {
        try {
            const result = await FacilityService.getAllFacilitiesForAdmin();
            return AppResponse.success(res, result, "Lấy danh sách cơ sở thành công", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await FacilityService.getFacilityById(Number(id));
            return AppResponse.success(res, result, "Lấy chi tiết cơ sở thành công", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getFacilityWithCourts(req, res, next) {
        try {
            const { id } = req.params;
            const result = await FacilityService.getFacilityWithCourts(Number(id));
            return AppResponse.success(res, result, "Lấy chi tiết cơ sở thành công", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const body = req.body;
            const result = await FacilityService.createFacility(body);
            return AppResponse.success(res, result, "Tạo cơ sở mới thành công", 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const body = req.body;
            const { id } = req.params;
            const result = await FacilityService.updateFacility(Number(id), body);
            return AppResponse.success(res, result, "Cập nhật cơ sở thành công", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await FacilityService.deleteFacility(Number(id));
            return AppResponse.success(res, result, "Xóa cơ sở thành công", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getTrash(req, res, next) {
        try {
            const result = await FacilityService.getDeletedFacilities();
            return AppResponse.success(res, result, "Lấy danh sách thùng rác thành công", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async restore(req, res, next) {
        try {
            const { id } = req.params;
            const result = await FacilityService.restoreFacility(Number(id));
            return AppResponse.success(res, result, "Khôi phục cơ sở thành công", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=facility.controller.js.map