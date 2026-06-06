import { redisClient } from '../config/redis.js';
import { systemConfigRepository } from '../repositories/systemConfig.repository.js';
import ApiError from '../utils/ErrorClass.js';
import type { CreateSystemConfigInput, UpdateSystemConfigInput } from '../validations/systemConfig.validation.js';

export class SystemConfigService {

    static async getAllConfigs() {
        return await systemConfigRepository.findAll({
            order: [['created_at', 'DESC']]
        });
    }

    // 2. Thêm mới cấu hình
    static async createConfig(data: CreateSystemConfigInput) {
        // Kiểm tra xem key đã tồn tại chưa
        const existingConfig = await systemConfigRepository.findOne({ where: { key: data.key } });
        if (existingConfig) {
            throw new ApiError(`Cấu hình với key '${data.key}' đã tồn tại!`, 400);
        }

        return await systemConfigRepository.create(data as any);
    }

    static async updateConfigById(id: number, data: UpdateSystemConfigInput) {
        // Tìm cấu hình cũ để lấy 'key'
        const config = await systemConfigRepository.findById(id);
        if (!config) throw new ApiError('Không tìm thấy cấu hình này!', 404);

        // Cập nhật Database
        const updatedConfig = await systemConfigRepository.update(id, data);

        // 🔥 TIÊU DIỆT CACHE CŨ ĐỂ DỮ LIỆU ĐƯỢC LÀM MỚI 🔥
        const cacheKey = `system_config:${config.key}`;
        await redisClient.del(cacheKey);
        
        console.log(`[Cache Invalidation] Đã xóa cache cho key: ${cacheKey}`);
        
        return updatedConfig;
    }

    static async deleteConfig(id: number) {
        const config = await systemConfigRepository.findById(id);
        if (!config) throw new ApiError('Không tìm thấy cấu hình này!', 404);

        await systemConfigRepository.destroy(id);

        // Dọn dẹp cả rác trong Redis
        const cacheKey = `system_config:${config.key}`;
        await redisClient.del(cacheKey);
        
        return true;
    }

    // (Giữ lại hàm update bằng key cũ của em để phòng hờ cần dùng trong code nội bộ)
    static async updateConfigByKey(key: string, newValue: string) {
        await systemConfigRepository.updateValue(key, newValue);
        const cacheKey = `system_config:${key}`;
        await redisClient.del(cacheKey);
        return true;
    }
    
}