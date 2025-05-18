const express = require('express');
const request = require('supertest');
const validateSignup = require('../../middlewares/validators/signupValidator');

describe('Signup Validator Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/signup', validateSignup, (req, res) => {
      res.status(200).json({ message: 'Validation passed' });
    });
  });

  const validUser = {
    firstName: 'hanaz',
    lastName: 'shaker',
    email: 'hanaz@example.com',
    mobile: '01234567890',
    password: 'password123',
    confirmPassword: 'password123',
    gender: 'male',
    username: 'hanazshaker',
    isAdmin: 'false',
  };

  it('should pass validation with valid data', async () => {
    const res = await request(app).post('/signup').send(validUser);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Validation passed');
  });

  it('should fail when fields are missing', async () => {
    const res = await request(app).post('/signup').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Validation failed');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should fail when email is invalid', async () => {
    const user = { ...validUser, email: 'not-an-email' };
    const res = await request(app).post('/signup').send(user);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'email',
          msg: 'Invalid email format',
        }),
      ])
    );
  });

  it('should fail when password is too short', async () => {
    const user = { ...validUser, password: '123', confirmPassword: '123' };
    const res = await request(app).post('/signup').send(user);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'password',
          msg: 'Password must be at least 6 characters',
        }),
      ])
    );
  });

  it('should fail when passwords do not match', async () => {
    const user = { ...validUser, confirmPassword: 'wrongpass' };
    const res = await request(app).post('/signup').send(user);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'confirmPassword',
          msg: 'Passwords do not match',
        }),
      ])
    );
  });

  it('should fail when mobile number is invalid', async () => {
    const user = { ...validUser, mobile: 'abc' };
    const res = await request(app).post('/signup').send(user);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'mobile',
          msg: 'Invalid mobile number',
        }),
      ])
    );
  });

  it('should fail when gender is invalid', async () => {
    const user = { ...validUser, gender: 'other' };
    const res = await request(app).post('/signup').send(user);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'gender',
          msg: 'Gender must be male or female',
        }),
      ])
    );
  });

  it('should fail when isAdmin is invalid', async () => {
    const user = { ...validUser, isAdmin: 'admin' };
    const res = await request(app).post('/signup').send(user);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'isAdmin',
          msg: 'Role must be selected',
        }),
      ])
    );
  });

  it('should fail when username is missing', async () => {
    const user = { ...validUser, username: '' };
    const res = await request(app).post('/signup').send(user);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'username',
          msg: 'Username is required',
        }),
      ])
    );
  });
});
