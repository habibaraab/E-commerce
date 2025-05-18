
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
max: 3,
  message: 'Rate limit exceeded',
});

module.exports = limiter;