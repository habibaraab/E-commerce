const request = require('supertest');
const express = require('express');
const rateLimiter = require('../../middlewares/security/RateLimiter');
const app = express();
app.use(rateLimiter);


app.get('/auth', (req, res) => {
  res.status(200).send('OK');
});

describe('RateLimiter Middleware', () => {
  it('should allow up to 3 requests and block the 4th', async () => {
    
    await request(app).get('/auth').expect(200);
    await request(app).get('/auth').expect(200);
    await request(app).get('/auth').expect(200);

    const res = await request(app).get('/auth').expect(429);
    
    expect(res.text).toContain('Rate limit exceeded');
  });
});
