import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../core/db';
import { User } from '@prisma/client';

interface LoginBody {
    username: string;
    password: string;
}

const generateToken = async (user: User, secret: string): Promise<String[]> => {
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

    const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ token }, secret, { expiresIn: '7d' });

    return [accessToken, refreshToken];
};

const load: RequestHandler = async (req, res, next) => {
    try {
        const secret = req.app.get('secret');
        const accessToken: string = req.cookies['access_token'];
        const refreshToken: string = req.cookies['refresh_token'];

        if (accessToken) {
            req.user = jwt.verify(accessToken, secret) as User;
        } else if (refreshToken) {
            const payload = jwt.verify(refreshToken, secret) as any;
            const user = await db.user.findFirst({ where: { token: payload.token } });
            if (!user) throw undefined;

            const [accessTokenNew, refreshTokenNew, payloadNew] = await generateToken(user, secret);

            res.cookie('access_token', accessTokenNew, { httpOnly: true, maxAge: 1000 * 60 * 60 * 1 });
            res.cookie('refresh_token', refreshTokenNew, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

            delete (user as any).password;
            delete (user as any).token;
            req.user = user;
        }
    } catch (err) {
        req.user = undefined;
    } finally {
        next();
    }
};
const guard: RequestHandler = (req, res, next) => {
    if (req.user) return next();
    next(res.error(401));
};

const login: RequestHandler = async (req, res, next) => {
    try {
        const secret = req.app.get('secret');
        const { username, password } = req.body as LoginBody;

        const user = await db.user.findUnique({ where: { username } });
        if (!user) throw res.error(404, 'User not found');

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) throw res.error(401, 'Password incorrect');

        const [accessToken, refreshToken] = await generateToken(user, secret);

        res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 1 });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

const logout: RequestHandler = async (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.status(204).send();
};

export default { load, guard, login, logout };
