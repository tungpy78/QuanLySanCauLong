import type { Request, Response, NextFunction } from 'express';
export declare class RevenueController {
    /**
     * GET /api/v1/admin/revenue/summary
     */
    static getSummary(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/v1/admin/revenue/chart
     */
    static getChart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/v1/admin/revenue/breakdown
     */
    static getBreakdown(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/v1/admin/revenue/transactions
     */
    static getTransactions(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=revenue.controller.d.ts.map