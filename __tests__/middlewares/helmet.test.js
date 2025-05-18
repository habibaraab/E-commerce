
const request = require('supertest');
const app = require('../../app');

describe('Helmet Security Headers', () => {
  test('should set X-DNS-Prefetch-Control header to off', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
  });

  test('should set X-Content-Type-Options header to nosniff', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  test('should set X-Frame-Options header to SAMEORIGIN', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });
});
