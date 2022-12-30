import { User } from '@prisma/client';
import { RequestHandler } from 'express';
import db from '../core/db';

export default {
    async index(req, res, next) {
        try {
            const users = await db.user.findMany({
                select: { id: true, username: true, role: true },
            });
            res.json({ users });
        } catch (err) {
            next(err);
        }
    },
    async show(req, res, next) {
        try {
            const id = req.params.id;
            const user = await db.user.findUnique({
                select: { id: true, role: true, username: true },
                where: { id: parseInt(id) },
            });

            if (!user) throw res.error(404, 'User not found');
            res.json({ user });
        } catch (err) {
            next(err);
        }
    },
} as {
    index: RequestHandler;
    show: RequestHandler;
};
