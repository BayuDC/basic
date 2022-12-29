import request from 'supertest';
import dotenv from 'dotenv';
import app from '../core/app';

let accessToken: string;
let refreshToken: string;

beforeAll(() => dotenv.config());

describe('POST /api/auth/login', () => {
    it('should return token as cookie on succesful login', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'admin123',
        });

        expect(response.status).toBe(204);
        expect(response.header['set-cookie']).toBeDefined();
        expect(response.header['set-cookie'][0]).toContain('access_token');
        expect(response.header['set-cookie'][1]).toContain('refresh_token');

        accessToken = response.header['set-cookie'][0];
        refreshToken = response.header['set-cookie'][1];
    });
    it('should return a message if user not found', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username: 'invalid',
            password: 'invalid',
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBeDefined();
        expect(response.body.message).toBe('User not found');
    });
    it('should return a message if password incorrect', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'invalid',
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();
        expect(response.body.message).toBe('Password incorrect');
    });
});
describe.skip('POST /api/auth/logout', () => {
    it('should clear the cookie', async () => {
        const response = await request(app).post('/api/auth/logout').set('Cookie', [accessToken, refreshToken]).send();

        expect(response.status).toBe(204);
        expect(response.header['set-cookie']).toBeDefined();
        expect(response.header['set-cookie'][0]).toContain('access_token=;');
        expect(response.header['set-cookie'][1]).toContain('refresh_token=;');
    });
    it('should return nothing if no token is present', async () => {
        const response = await request(app).post('/api/auth/logout').send();
        expect(response.status).toBe(401);
    });
});
describe('GET /api/auth', () => {
    it('should return user data', async () => {
        const response = await request(app).get('/api/auth').set('Cookie', [accessToken, refreshToken]).send();

        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('username');
        expect(response.body.user).toHaveProperty('role');
        expect(response.body.user).not.toHaveProperty(['password']);
    });
    it('should return user data and refresh the token', async () => {
        const response = await request(app).get('/api/auth').set('Cookie', [refreshToken]).send();

        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('username');
        expect(response.body.user).toHaveProperty('role');
        expect(response.body.user).not.toHaveProperty(['password']);
        expect(response.header['set-cookie']).toBeDefined();
        expect(response.header['set-cookie'][0]).toContain('access_token');
        expect(response.header['set-cookie'][1]).toContain('refresh_token');
    });
    it('should return nothing if no token is present', async () => {
        const response = await request(app).get('/api/auth').send();
        expect(response.status).toBe(401);
    });
});
