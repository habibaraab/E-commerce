const Products = require('../models/product');

const getProducts = async (req, res) => {
    const { showDiscount, calculateNewPrice } = require('../helpers/discount');
    const { convertToUppercase } = require('../helpers/productFormat');

    const products = await Products.find();
    res.render('admin', {
        products,
        helpers: {
            showDiscount,
            calculateNewPrice,
            convertToUppercase
        }
    });
    // res.status(200).json({products});
};

const getProductsForUser = async (req, res) => {
    const { showDiscount, calculateNewPrice } = require('../helpers/discount');
    const { convertToUppercase } = require('../helpers/productFormat');

    const products = await Products.find();
    res.render('user', {
        products,
        helpers: {
            showDiscount,
            calculateNewPrice,
            convertToUppercase
        }
    });
};

const getAddProductForm = (req, res) => {
    res.render('product-form', {
        product: {},
        isEdit: false
    });
};

const getEditProductForm = async (req, res) => {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    res.render('product-form', {
        product,
        isEdit: true
    });
};

const createProduct = async (req, res) => {
    const newProduct = new Products({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image: req.body.image,
        discount: req.body.discount || 0,
        isTest: req.body.isTest === 'true' || req.body.isTest === true
    });

    await newProduct.save();
    res.redirect('/admin');
};

const updateProduct = async (req, res) => {
    const productId = req.params.id;

    const result = await Products.updateOne(
        { _id: productId },
        {
            $set: {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                image: req.body.image,
                discount: req.body.discount || 0,
            },
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).send('Product not found');
    }

    res.redirect('/admin');
};

const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    const result = await Products.deleteOne({ _id: productId });
    if (result.deletedCount === 0) {
        return res.status(404).send('Product not found');
    }

    res.redirect('/admin');
};

const applyDiscount = async (req, res) => {
    const productId = req.params.id;
    const discount = parseFloat(req.body.discount);

    const product = await Products.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    product.discount = discount;
    await product.save();

    res.redirect('/admin');
};

const removeDiscount = async (req, res) => {
    const productId = req.params.id;

    const product = await Products.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    product.discount = 0;
    await product.save();

    res.redirect('/admin');
};

module.exports = {
    getProducts,
    getAddProductForm,
    getEditProductForm,
    createProduct,
    updateProduct,
    deleteProduct,
    applyDiscount,
    removeDiscount,
    getProductsForUser
};

