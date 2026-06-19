import { createClient } from 'redis';
import 'dotenv/config'; // Nhớ cài và import dotenv
export const redisClient = createClient({
    // Đọc từ file .env, nếu quên khai báo thì lấy tạm localhost
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Đã kết nối thành công tới Redis!'));
export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};
//# sourceMappingURL=redis.js.map