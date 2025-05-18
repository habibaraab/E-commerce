const request = require('supertest');
const app = require('../../app');

describe('XSS Clean Middleware', () => {
  test('should clean script tags from input', async () => {
    const maliciousPayload = {
      comment: '<script>alert("xss")</script>'
    };

    const res = await request(app)
      .post('/test-xss')
      .send(maliciousPayload);

    const cleaned = res.body.comment;


    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('</script>');

  
    expect(cleaned).toContain('&lt;script>');
    expect(cleaned).toContain('&lt;/script>');
  });

  test('should keep safe content unchanged', async () => {
    const safePayload = {
      comment: 'This is a safe comment.'
    };

    const res = await request(app)
      .post('/test-xss')
      .send(safePayload);

    expect(res.body.comment).toBe('This is a safe comment.');
  });
});