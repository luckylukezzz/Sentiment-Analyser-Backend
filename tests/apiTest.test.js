// tests/apiTest.test.js
const request = require('supertest');
const { app, createMySQLPool } = require('../app'); // Import the app for testing

describe('GET /api/v1/dashboard/improvement?asin=B004YRBM1Q', () => {
    beforeAll(async () => {
        await createMySQLPool(); // Ensure MySQL pool is created before tests
    });

    it('should return all users', async () => {
        const res = await request(app)
            .get('/api/v1/dashboard/improvement?asin=B004YRBM1Q')
            .expect(200);

        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});
