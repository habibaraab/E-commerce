const mongoose = require('mongoose');
const app = require('../../app');
const userModel = require('../../models/user');
const request = require('supertest');
require('dotenv').config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await userModel.deleteMany({ isTest: true });
  await mongoose.connection.close();
});

describe('register', () => {
  it('should render signup page', async () => {
    const res = await request(app).get('/auth/signup');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Sign Up');
  });

  it('should register a new user', async () => {
    const testEmail = `register${Date.now()}@example.com`;
    const res = await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'testuser',
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      isAdmin: false,
      isTest: true,
    });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/user');

    const user = await userModel.findOne({ email: testEmail });
    expect(user).toBeDefined();
    expect(user.firstName).toBe('Test');
  });
});

describe('login', () => {
  it('should render login page', async () => {
    const res = await request(app).get('/auth/login');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Login');
  });

  it('should login a user', async () => {
    const testEmail = `login${Date.now()}@example.com`;

    await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'loginuser',
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      isAdmin: false,
      isTest: true,
    });

    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: 'StrongPassword123!',
    });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBeDefined();
  });

  it('should fail login with incorrect password', async () => {
    const testEmail = `failpass${Date.now()}@example.com`;

    await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'wrongpassuser',
      email: testEmail,
      password: 'CorrectPass123!',
      confirmPassword: 'CorrectPass123!',
      isTest: true,
    });

    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: 'WrongPass!',
    });

    expect(res.status).toBe(400);
  });

  it('should fail login with invalid email', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'notfound@example.com',
      password: 'AnyPass123!',
    });

    expect(res.status).toBe(400);
  });
});

describe('logout', () => {
  it('should logout from the system', async () => {
    const res = await request(app).get('/logout');
    expect(res.status).toBe(302);
  });
});
