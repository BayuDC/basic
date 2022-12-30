import { User } from '@prisma/client';
import { RequestHandler, RequestParamHandler } from 'express';
import db from '../core/db';

interface UserBody {
    username: string;
    password: string;
}

export default {
    async load(req, res, next, id: string) {
        try {
            const user = await db.user.findUnique({
                select: { id: true, role: true, username: true },
                where: { id: parseInt(id) },
            });

            if (!user) throw res.error(404, 'User not found');
            res.data = user;
            next();
        } catch (err) {
            next(err);
        }
    },
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
            const user = res.data;
            res.json({ user });
        } catch (err) {
            next(err);
        }
    },
    async store(req, res, next) {
        try {
            const body = req.body as UserBody;
            const user = await db.user.create({
                data: {
                    username: body.username,
                    password: body.password,
                    role: 'user',
                },
            });

            res.status(201).json({ user });
        } catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const body = req.body as UserBody;
            const user = res.data as User;
            const userNew = await db.user.update({
                where: { id: user.id },
                data: {
                    username: body.username,
                    password: body.password,
                },
            });

            res.json({ user: userNew });
        } catch (err) {
            next(err);
        }
    },
} as {
    load: RequestParamHandler;
    index: RequestHandler;
    show: RequestHandler;
    store: RequestHandler;
    update: RequestHandler;
};
