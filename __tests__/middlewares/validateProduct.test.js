require('dotenv').config();
const express = require('express');
const request = require('supertest');
const validateProduct = require('../../middlewares/validators/validateProduct');

let app;

beforeEach(() => {
  app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.set('view engine', 'pug');
  app.set('views', './views');

  app.post('/products', validateProduct, (req, res) => {
    res.status(200).json({ message: 'Validation passed' });
  });
});

describe('validateProduct middleware', () => {
  it('should pass with valid product data (API request)', async () => {
    const res = await request(app).post('/products').set('Content-Type', 'application/json').send({
      title: 'Valid Product',
      price: 99.99,
      image: 'http://example.com/image.jpg',
      discount: 10,
      category: 'Electronics',
      description: 'A solid product',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Validation passed');
  });

  it('should fail with missing title (API request)', async () => {
    const res = await request(app).post('/products').set('Content-Type', 'application/json').send({
      price: 99.99,
      image: 'http://example.com/image.jpg'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Validation failed');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Title is required' })
      ])
    );
  });

  it('should fail with invalid discount (API request)', async () => {
    const res = await request(app).post('/products').set('Content-Type', 'application/json').send({
      title: 'Product',
      price: 50,
      image: 'http://example.com/image.jpg',
      discount: 150
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Discount must be between 0 and 100' })
      ])
    );
  });

  it('should render form on error (form request)', async () => {
    const res = await request(app)
      .post('/products')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        price: 50,
        image: 'http://example.com/image.jpg'
      });

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('product');
  });
});
