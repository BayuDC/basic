import request from 'supertest';
import dotenv from 'dotenv';
import app from '../core/app';

beforeAll(() => dotenv.config());

describe('GET /', () => {
    it('should return html', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
});

describe('GET /api', () => {
    it('should return json', async () => {
        const response = await request(app).get('/api');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    });
});
