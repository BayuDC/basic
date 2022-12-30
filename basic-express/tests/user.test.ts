import request from 'supertest';
import app from '../core/app';

const agentUser = request.agent(app);
const agentAdmin = request.agent(app);

let id: number;

beforeAll(async () => {
    await agentUser.post('/api/auth/login').send({ username: 'user', password: 'user1234' });
    await agentAdmin.post('/api/auth/login').send({ username: 'admin', password: 'admin123' });
});

describe('GET /api/users', () => {
    it('should return user collection', async () => {
        const res = await agentAdmin.get('/api/users').send();

        expect(res.status).toBe(200);
        expect(res.body.users).toBeInstanceOf(Array);
        expect(res.body.users[0]).toHaveProperty('id');
        expect(res.body.users[0]).toHaveProperty('username');
        expect(res.body.users[0]).toHaveProperty('role');
        expect(res.body.users[0]).not.toHaveProperty('password');
    });
});
describe('GET /api/users/:id', () => {
    it('should return a single user', async () => {
        const res = await agentAdmin.get('/api/users/1').send();

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('username');
        expect(res.body.user).toHaveProperty('role');
        expect(res.body.user).not.toHaveProperty('password');
    });
    it('should return nothing if the user is not found', async () => {
        const res = await agentAdmin.get('/api/users/0').send();

        expect(res.status).toBe(404);
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toBe('User not found');
    });
});
describe('POST /api/users', () => {
    it('should create a new user and return it', async () => {
        const body = { username: 'sampleuser', password: 'samplepassword' };
        const res = await agentAdmin.post('/api/users').send(body);

        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('role');
        expect(res.body.user).toHaveProperty('username', body.username);

        id = res.body.user.id;
    });
    it('should do nothing if auth user is not admin', async () => {
        const res = await agentUser.post('/api/users').send();
        expect(res.status).toBe(403);
    });
    describe('Body Validation', () => {
        it('should validate required fields', async () => {
            const body = {};
            const res = await agentAdmin.post('/api/users').send(body);

            expect(res.status).toBe(400);
            expect(res.body.details).toBeDefined();
            expect(res.body.details).toHaveProperty('username', 'The username field is required');
            expect(res.body.details).toHaveProperty('password', 'The password field is required');
        });
        it('should validate duplicate username', async () => {
            const body = { username: 'user', password: 'samplepassword' };
            const res = await agentAdmin.post('/api/users').send(body);

            expect(res.status).toBe(400);
            expect(res.body.details).toBeDefined();
            expect(res.body.details).toHaveProperty('username', 'A user with this username already exists');
        });
        it('should validate password length', async () => {
            const body = { username: 'sampleuser2', password: 'short' };
            const res = await agentAdmin.post('/api/users').send(body);

            expect(res.status).toBe(400);
            expect(res.body.details).toBeDefined();
            expect(res.body.details).toHaveProperty('password', 'The minimum password length is 8 characters');
        });
    });
});
describe('PUT /api/users/:id', () => {
    it('should update a user and return it', async () => {
        const body = { username: 'sampleuser2', password: 'samplepassword2' };
        const res = await agentAdmin.put('/api/users/' + id).send(body);

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('role');
        expect(res.body.user).toHaveProperty('username', body.username);
    });
    it('should do nothing if auth user is not admin', async () => {
        const res = await agentUser.put('/api/users/' + id).send();
        expect(res.status).toBe(403);
    });
    it('should do nothing if the user is not found', async () => {
        const res = await agentAdmin.put('/api/users/0').send();
        expect(res.status).toBe(404);
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toBe('User not found');
    });
    describe('Body Validation', () => {
        it('should validate duplicate username', async () => {
            const body = { username: 'user' };
            const res = await agentAdmin.put('/api/users/' + id).send(body);

            expect(res.status).toBe(400);
            expect(res.body.details).toBeDefined();
            expect(res.body.details).toHaveProperty('username', 'A user with this username already exists');
        });
        it('should bypass validate themself username', async () => {
            const body = { username: 'sampleuser2' };
            const res = await agentAdmin.put('/api/users/' + id).send(body);

            expect(res.status).toBe(200);
        });
        it('should validate password length', async () => {
            const body = { password: 'short' };
            const res = await agentAdmin.put('/api/users/' + id).send(body);

            expect(res.status).toBe(400);
            expect(res.body.details).toBeDefined();
            expect(res.body.details).toHaveProperty('password', 'The minimum password length is 8 characters');
        });
    });
});
describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
        const res = await agentAdmin.delete('/api/users/' + id).send();
        expect(res.status).toBe(204);
    });
    it('should do nothing if auth user is not admin', async () => {
        const res = await agentUser.delete('/api/users/' + id).send();
        expect(res.status).toBe(403);
    });
    it('should do nothing if the user is not found', async () => {
        const res = await agentAdmin.delete('/api/users/0').send();
        expect(res.status).toBe(404);
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toBe('User not found');
    });
});
