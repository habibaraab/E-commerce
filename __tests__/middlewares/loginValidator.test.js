const express = require('express');
const request = require('supertest');
const validateLogin = require('../../middlewares/validators/validateLogin');

describe('Login Validator Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/login', validateLogin, (req, res) => {
      res.status(200).json({ message: 'Validation passed' });
    });
  });

  it('should pass with valid email and password', async () => {
    const res = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Validation passed');
  });

  it('should fail when email is missing', async () => {
    const res = await request(app).post('/login').send({
      password: 'password123',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'email', msg: 'Invalid email format' }),
      ])
    );
  });

  it('should fail when password is missing', async () => {
    const res = await request(app).post('/login').send({
      email: 'test@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'password', msg: 'Password is required' }),
      ])
    );
  });

  it('should fail when email is invalid', async () => {
    const res = await request(app).post('/login').send({
      email: 'invalid-email',
      password: 'password123',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'email', msg: 'Invalid email format' }),
      ])
    );
  });
});
