const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const Product = require('../../models/product');
const controller = require('../../controllers/product.controller');

require('dotenv').config();

let app;
let productId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await Product.deleteMany({ isTest: true });
    await mongoose.connection.close();
});

beforeEach(async () => {
  app = express();
  app.use(express.json());
  app.set('view engine', 'hbs');
  app.set('views', './views');

  // Replace res.render to return JSON instead
  app.response.render = function (_, data) {
    this.json(data);
  };

  app.get('/admin', controller.getProducts);
  app.get('/user', controller.getProductsForUser);
  app.get('/add-product', controller.getAddProductForm);
  app.get('/edit/:id', controller.getEditProductForm);
  app.post('/products', controller.createProduct);
  app.post('/products/:id/update', controller.updateProduct);
  app.post('/products/delete/:id', controller.deleteProduct);
  app.post('/apply-discount/:id', controller.applyDiscount);
  app.post('/remove-discount/:id', controller.removeDiscount);

  const product = new Product({
    title: 'Test Product',
    description: 'Test description',
    category: 'Test',
    price: 100,
    image: 'http://example.com/img.jpg',
    discount: 0,
    isTest: true,
  });
  await product.save();
  productId = product._id.toString();
});

afterEach(async () => {
  await Product.deleteMany({ isTest: true });
});

describe('Integration Test - Product Controller', () => {
  it('GET /admin should return all products', async () => {
    const res = await request(app).get('/admin');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('GET /user should return all products for user', async () => {
    const res = await request(app).get('/user');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('GET /add-product should return empty product form', async () => {
    const res = await request(app).get('/add-product');
    expect(res.status).toBe(200);
    expect(res.body.product).toEqual({});
    expect(res.body.isEdit).toBe(false);
  });

  it('GET /edit/:id should return product form with data', async () => {
    const res = await request(app).get(`/edit/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.product._id).toBe(productId);
    expect(res.body.isEdit).toBe(true);
  });

  it('POST /products should create a new product', async () => {
    const res = await request(app).post('/products').send({
      title: 'New Product',
      description: 'Desc',
      category: 'Cat',
      price: 50,
      image: 'http://img.com',
      discount: 10,
      isTest: true,
    });
    expect(res.status).toBe(302);
  });

  it('POST /products/:id/update should update the product', async () => {
    const res = await request(app).post(`/products/${productId}/update`).send({
      title: 'Updated',
      description: 'Updated Desc',
      category: 'Updated Cat',
      price: 70,
      image: 'http://updated.com',
      discount: 5,
    });
    expect(res.status).toBe(302);
  });

  it('POST /products/delete/:id should delete the product', async () => {
    const res = await request(app).post(`/products/delete/${productId}`);
    expect(res.status).toBe(302);
  });

  it('POST /apply-discount/:id should apply discount', async () => {
    const res = await request(app).post(`/apply-discount/${productId}`).send({
      discount: 15,
    });
    expect(res.status).toBe(302);
  });

  it('POST /remove-discount/:id should remove discount', async () => {
    const res = await request(app).post(`/remove-discount/${productId}`);
    expect(res.status).toBe(302);
  });
});
