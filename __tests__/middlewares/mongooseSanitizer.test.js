const request = require('supertest');
const app = require('../../app');

describe('Mongo Sanitize Middleware', () => {
  test('should remove $ and . from keys', async () => {
    const maliciousPayload = {
      username: { $gt: '' },
      email: 'user@example.com',
      profile: {
        'bio.description': 'test'
      }
    };

    const res = await request(app)
      .post('/test-sanitize')
      .send(maliciousPayload);

    expect(res.body).not.toHaveProperty('username.$gt');
    expect(res.body.profile).not.toHaveProperty('bio.description');
  });

  test('should allow normal input', async () => {
    const cleanPayload = {
      username: 'normaluser',
      email: 'user@example.com'
    };

    const res = await request(app)
      .post('/test-sanitize')
      .send(cleanPayload);

    expect(res.body.username).toBe('normaluser');
    expect(res.body.email).toBe('user@example.com');
  });
});