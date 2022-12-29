import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../core/db';

interface LoginBody {
    username: string;
    password: string;
}

export const login: RequestHandler = async (req, res, next) => {
    const { username, password } = req.body as LoginBody;

    const user = await db.user.findUnique({ where: { username } });
    if (!user) return next(res.error(404, 'User not found'));

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return next(res.error(401, 'Password incorrect'));

    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
    };
    const token = crypto.randomBytes(32).toString('hex');
    await db.user.update({
        where: { id: user.id },
        data: { token },
    });

    const accessToken = jwt.sign(payload, 'secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ token }, 'secret', { expiresIn: '7d' });

    res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 1 });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

    res.status(204).send();
};
