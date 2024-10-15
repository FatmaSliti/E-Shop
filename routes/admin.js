const path = require('path')

const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct)

// /admin/products => GET
router.get('/products', adminController.getProducts)

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct) //no dynamic segment because it's a post request (data can be enclosed in the request we're sending)

router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router


















// const products = [];

// /admin/add-product => GET
// router.get('/add-product', (req, res, next) => {
//   res.render('add-product', {
//     pageTitle: 'Add Product',
//     path: '/admin/add-product',
//     formsCSS: true,
//     productCSS: true,
//     activeAddProduct: true
//   });
// });


//after adding controllers
// /admin/add-product => GET
// router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
// router.get('/products', adminController.getProducts)


// /admin/add-product => POST
// router.post('/add-product', (req, res, next) => {
//   products.push({ title: req.body.title });
//   res.redirect('/');
// });

// router.post('/add-product', adminController.postAddProduct);

// module.exports = router
// exports.routes = router;
// exports.products = products;
