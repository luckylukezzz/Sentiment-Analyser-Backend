const request = require('supertest');
const { app, createMySQLPool, closeMySQLPool } = require('../app');

describe('GET /api/v1/dashboard/improvement', () => {
    beforeAll(async () => {
        await createMySQLPool();
    });

    afterAll(async () => {
        await closeMySQLPool();
    });

    it('should return improvement data for a given ASIN', async () => {
        const res = await request(app)
            .get('/api/v1/dashboard/improvement?asin=B004YRBM1Q')
            .expect(200);

        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});