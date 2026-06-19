import { ZodError } from 'zod';
import AppResponse from '../utils/AppResponse.js';
export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => `${issue.path.join('.')} - ${issue.message}`);
            return AppResponse.error(res, errorMessages.join(', '), 400);
        }
        return next(error);
    }
};
//# sourceMappingURL=validate.middleware.js.map