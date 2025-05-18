const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');
const isUser = require('../middlewares/auth/isUser');
router.use(isUser);

router.get('/', controller.getProductsForUser);


module.exports = router;
