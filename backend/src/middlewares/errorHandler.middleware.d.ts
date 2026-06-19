import type { Request, Response, NextFunction } from 'express';
declare const errorHandlingMiddleware: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default errorHandlingMiddleware;
//# sourceMappingURL=errorHandler.middleware.d.ts.map