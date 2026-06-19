import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';
export declare const validate: (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=validate.middleware.d.ts.map