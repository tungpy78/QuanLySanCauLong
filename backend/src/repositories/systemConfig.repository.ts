import models from '../models/index.js';
import { redisClient } from '../config/redis.js';
import { BaseRepository } from './base.repository.js';

class SystemConfigRepository extends BaseRepository<any>{
    constructor() {
        super(models.SystemConfig);
    }
    
    async findByKey(key: string) {
        const cacheKey = `system_config:${key}`; // Đặt tên key theo prefix để dễ quản lý

        // 1. TÌM TRONG CACHE TRƯỚC (Read from RAM)
        const cachedValue = await redisClient.get(cacheKey);
        
        if (cachedValue) {
            console.log(`[Cache Hit] Lấy cấu hình ${key} từ Redis cực nhanh!`);
            return { value: cachedValue }; // Trả về luôn, không cần chạm vào Database
        }

        // 2. NẾU CACHE KHÔNG CÓ (Cache Miss), TÌM TRONG DATABASE (Read from Disk)
        console.log(`[Cache Miss] Đang lấy cấu hình ${key} từ Database...`);
        const config = await models.SystemConfig.findOne({ where: { key } });

        // 3. LƯU NGƯỢC LẠI VÀO CACHE ĐỂ LẦN SAU DÙNG (Save to Cache)
        if (config) {
            await redisClient.set(cacheKey, config.value);
        }

        return config;
    }

    async updateValue(key: string, newValue: string) {
        // Dùng lệnh update của Sequelize để cập nhật trực tiếp
        const [updatedRows] = await models.SystemConfig.update(
            { value: newValue },
            { where: { key } }
        );

        if (updatedRows === 0) {
            throw new Error(`Không tìm thấy cấu hình hệ thống với key: ${key}`);
        }

        return true;
    }
}

export const systemConfigRepository = new SystemConfigRepository();