import type { Request, Response, NextFunction } from "express";
export declare class PaymentController {
    static vnpayIpn(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static vnpayReturn(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static posOrderVNPayIpn(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static payCash(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=payment.controller.d.ts.map