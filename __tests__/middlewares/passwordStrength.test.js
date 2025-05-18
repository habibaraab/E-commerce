const request = require('supertest');
const express = require('express');
const checkPasswordStrength = require('../../middlewares/security/checkPasswordStrength');

describe('Password Strength Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/test-password', checkPasswordStrength, (req, res) => {
      res.status(200).json({ message: 'Strong password' });
    });
  });

  it('should reject weak passwords', async () => {
    const res = await request(app).post('/test-password').send({
      password: '123'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password is too weak. Try a stronger one.');
  });

  it('should accept strong passwords', async () => {
    const res = await request(app).post('/test-password').send({
      password: 'MyStr0ngP@ssw0rd!'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Strong password');
  });
});