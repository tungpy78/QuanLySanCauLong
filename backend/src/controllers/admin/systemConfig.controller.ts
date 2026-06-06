import type { Request, Response, NextFunction } from 'express';
import AppResponse from '../../utils/AppResponse.js';
import { SystemConfigService } from '../../services/systemConfig.service.js';


export class SystemConfigController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const configs = await SystemConfigService.getAllConfigs();
            return AppResponse.success(
                res,
                configs,
                'Lấy danh sách cấu hình thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const newConfig = await SystemConfigService.createConfig(req.body);
            return AppResponse.success(
                res,
                newConfig,
                'Tạo cấu hình thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const updatedConfig = await SystemConfigService.updateConfigById(
                id,
                req.body
            );

            return AppResponse.success(
                res,
                updatedConfig,
                'Cập nhật cấu hình thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await SystemConfigService.deleteConfig(id);

            return AppResponse.success(
                res,
                result,
                'Xóa cấu hình thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}