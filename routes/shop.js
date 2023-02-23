const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

const routeProtection = require('../middleware/is-auth')

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', routeProtection, shopController.getCart);

router.post('/cart', routeProtection, shopController.postCart);

router.post('/cart-delete-item', routeProtection, shopController.postCartDeleteProduct);

router.get('/checkout', routeProtection, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

// router.post('/create-order', routeProtection, shopController.postOrder);

router.get('/orders', routeProtection, shopController.getOrders);

router.get('/orders/:orderId', routeProtection, shopController.getInvoices);

module.exports = router;
