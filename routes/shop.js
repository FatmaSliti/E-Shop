const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');
const shopController = require('../controllers/shop')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts)

// router.get('/products/delete') //this specific route should be before the dynamic segment 

router.get('/products/:productId', shopController.getProduct) 

router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

router.post('/cart-delete-item', shopController.postCartDeleteProduct)

router.post('/create-order', shopController.postOrder)

router.get('/orders', shopController.getOrders)


module.exports = router;














// router.get('/', (req, res, next) => {
//   const products = adminData.products;
//   res.render('shop', {
//     prods: products,
//     pageTitle: 'Shop',
//     path: '/',
//     hasProducts: products.length > 0,
//     activeShop: true,
//     productCSS: true
//   });
// });
