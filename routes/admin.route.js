const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');

const isAdmin = require('../middlewares/auth/isAdmin');
router.use(isAdmin);
const validateProduct = require('../middlewares/validators/validateProduct');




router.get('/', controller.getProducts);
router.post('/products', validateProduct, controller.createProduct);
router.get('/add-product', controller.getAddProductForm);
router.get('/edit/:id', controller.getEditProductForm);
router.post('/products/:id/update', validateProduct, controller.updateProduct);
router.post('/products/delete/:id', controller.deleteProduct);
router.post('/apply-discount/:id', controller.applyDiscount);
router.post('/remove-discount/:id', controller.removeDiscount);

module.exports = router;
