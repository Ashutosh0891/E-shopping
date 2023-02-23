const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const{body}=require('express-validator');

//middleware to protect the routes from direct searching from url
const routeProtection = require('../middleware/is-auth')

// /admin/add-product => GET
router.get('/add-product', routeProtection, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', routeProtection, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product',[
    body('title',"Title should be atleast 3 characters long")
    .isString()
    .trim()
    .isLength({min:3}),

    body('price','invalid price')
    .isFloat(),

    body('description','description should be atleast 5 characters long')
    .isLength({min:5,max:400})
    .trim()
], routeProtection, adminController.postAddProduct);

router.get('/edit-product/:productId', routeProtection, adminController.getEditProduct);

router.post('/edit-product',[
    body('title',"Title should be atleast 3 characters long")
    .isString()
    .trim()
    .isLength({min:3}),

    body('price','invalid price')
    .isFloat(),

    body('description','description should be atleast 5 characters long')
    .isLength({min:5,max:400})
    .trim()
], routeProtection, adminController.postEditProduct);

router.delete('/product/:productId', routeProtection, adminController.deleteProduct);

module.exports = router;
