const mongoose = require('mongoose');
const app = require('../../app');
const request = require('supertest');
const userModel = require('../../models/user');
const productModel = require('../../models/product');
require('dotenv').config();

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set in environment variables');
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  jest.setTimeout(10000);
});


afterEach(async () => {
  await userModel.deleteMany({ isTest: true });
  await productModel.deleteMany({ isTest: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  it('should get products for user', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        mobile: '0123456789',
        gender: 'female',
        username: 'loginuser',
        email: `login${Date.now()}@example.com`,
        password: 'root123!',
        confirmPassword: 'root123!',
        isAdmin: false,
        isTest: true,
      });

    expect(userRes.status).toBe(302); // ملاحظة: 400 معناها إن في فشل، هل ده متعمد؟

    await productModel.create({
      title: 'Test Product',
      image: 'uploads/test.jpg',
      category: 'Test Product',
      price: 99,
      description: 'A product for testing',
      isTest: true,
    });

    const res = await request(app).get('/user');
    expect(res.status).toBe(302);
    expect(res.text).toContain('/auth/login');
  });
});
