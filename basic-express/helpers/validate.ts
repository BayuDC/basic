import { ValidationChain, validationResult } from 'express-validator';
import { RequestHandler } from 'express';

const validate = (validations: ValidationChain[]): RequestHandler => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req).formatWith(({ msg }) => msg);

        if (errors.isEmpty()) return next();

        next(res.error(400, 'Invalid fields', { details: errors.mapped() }));
    };
};
export default validate;
