import { RequestHandler } from 'express';

const guard = (): RequestHandler => {
    return (req, res, next) => {
        if (req.user) return next();
        next(res.error(401));
    };
};
const gate = (role: String): RequestHandler => {
    return (req, res, next) => {
        const user = req.user;
        if (user?.role == role) return next();
        next(res.error(403));
    };
};

export default {
    guard,
    gate,
};
