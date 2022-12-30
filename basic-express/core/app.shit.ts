import express from 'express';
import { HttpError, CreateHttpError } from 'http-errors';
import { User } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
        interface Response {
            data: object;
            error: CreateHttpError;
        }
    }
}
