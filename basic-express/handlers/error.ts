import { ErrorRequestHandler, RequestHandler } from 'express';
import createError, { HttpError } from 'http-errors';

export default {
    init(req, res, next) {
        res.error = createError;
        next();
    },
    handle(error: HttpError, req, res, next) {
        res.status(error.status || 500);
        res.json({
            message: error.message || error.statusText || 'Something went wrong',
            details: error.details,
        });
    },
} as {
    init: RequestHandler;
    handle: ErrorRequestHandler;
};
