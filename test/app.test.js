const app = require('./../app');
var request = require('supertest'); 

describe('test endpoints', () => {
    test('call home directory', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });


    test('call login and expect redirect', async () => {
        const response = await request(app).get('/login');
        expect(response.statusCode).toBe(302);
    });

    test('call callback and expect redirect', async () => {
        const response = await request(app).get('/callback');
        expect(response.header.location).toBe("/#error=state_mismatch");
        expect(response.cookies).toBe(undefined);
        expect(response.statusCode).toBe(302);
    });
})