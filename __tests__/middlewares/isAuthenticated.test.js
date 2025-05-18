const express = require('express');
const request = require('supertest');
const session = require('express-session');
const isAuthenticated = require('../../middlewares/auth/isAuthenticated');

const app = express();

app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));

// Fake login route to set session user
app.get('/set-session', (req, res) => {
  req.session.user = { id: 1, name: 'Test User' };
  res.send('Session set');
});

// Protected route using middleware
app.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).send('Access granted');
});

describe('isAuthenticated Middleware Integration', () => {
  it('should allow access when user is authenticated', async () => {
    const agent = request.agent(app); // persist cookies

    // Simulate login
    await agent.get('/set-session');

    // Access protected route
    const res = await agent.get('/protected');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Access granted');
  });

  it('should redirect to /auth/login for unauthenticated HTML requests', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Accept', 'text/html');

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/login');
  });

  it('should return 401 JSON for unauthenticated JSON requests', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
