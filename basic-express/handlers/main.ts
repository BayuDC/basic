import { RequestHandler } from 'express';

export default {
    web(req, res) {
        res.send('<h1>Hello World!</h1>');
    },
    api(req, res) {
        res.json({ message: 'Hello World' });
    },
} as {
    web: RequestHandler;
    api: RequestHandler;
};
