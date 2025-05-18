const mongoose = require('mongoose');
const app = require('../../app');
const userModel = require('../../models/user');
const request = require('supertest');
const session = require('supertest-session'); // لتتبع الجلسات

require('dotenv').config();

// زيادة المهلة الزمنية للاختبارات
jest.setTimeout(20000); // 20 ثانية

let testSession = null; // لتتبع الجلسة

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env file. Please set it to a valid MongoDB connection string.');
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  testSession = session(app); // إنشاء جلسة لتتبع الطلبات
});

afterAll(async () => {
  await userModel.deleteMany({ isTest: true });
  await mongoose.connection.close();
});

describe('register', () => {
  it('should render signup page', async () => {
    const res = await testSession.get('/auth/signup');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Sign Up');
  });

  it('should register a new user', async () => {
    const testEmail = `register${Date.now()}@example.com`;
    const res = await testSession.post('/auth/register').send({
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
    const res = await testSession.get('/auth/login');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Login');
  });

  it('should login a user', async () => {
    const testEmail = `login${Date.now()}@example.com`;

    await testSession.post('/auth/register').send({
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

    const res = await testSession.post('/auth/login').send({
      email: testEmail,
      password: 'StrongPassword123!',
    });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBeDefined();
  });

  it('should fail login with incorrect password', async () => {
    const testEmail = `failpass${Date.now()}@example.com`;

    await testSession.post('/auth/register').send({
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

    const res = await testSession.post('/auth/login').send({
      email: testEmail,
      password: 'WrongPass!',
    });

    expect(res.status).toBe(400);
  });

  it('should fail login with invalid email', async () => {
    const res = await testSession.post('/auth/login').send({
      email: 'notfound@example.com',
      password: 'AnyPass123!',
    });

    expect(res.status).toBe(400);
  });
});

describe('logout', () => {
  it('should logout from the system', async () => {
    const testEmail = `logout${Date.now()}@example.com`;
    await testSession.post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'logoutuser',
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      isAdmin: false,
      isTest: true,
    });

    await testSession.post('/auth/login').send({
      email: testEmail,
      password: 'StrongPassword123!',
    });

    const res = await testSession.get('/logout');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/auth/login');
  });
});