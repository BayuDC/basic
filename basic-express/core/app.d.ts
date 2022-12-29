import express from 'express';
import { HttpError } from 'http-errors';

interface User {
    id: number;
    role: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
        interface Response {
            data: object;
            error(status, message?): HttpError;
        }
    }
}
