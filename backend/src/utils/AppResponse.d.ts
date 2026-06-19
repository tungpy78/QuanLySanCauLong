import type { Response } from 'express';
/**
 * Class này giúp chuẩn hóa dữ liệu trả về cho Frontend
 * Format chung: { success: boolean, message: string, data: any, statusCode: number }
 */
declare class AppResponse {
    static success(res: Response, data?: any, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    static error(res: Response, message?: string, statusCode?: number): Response<any, Record<string, any>>;
}
export default AppResponse;
//# sourceMappingURL=AppResponse.d.ts.map