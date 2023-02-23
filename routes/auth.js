const express = require('express');

const authController = require('../controllers/auth');

const { check, body } = require('express-validator');
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail()
        ,

        body('password', 'Password has to be valid.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
);


//array used to keep every field grouped
router.post('/signup',
    [
        check('email').isEmail()
            .withMessage('Invalid email address')
            .custom((value, { req }) => {
                // if(value===""){

                // }
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject("Email already exists! Pick a different email.");
                        }
                    })
            })
            .normalizeEmail()

        ,

        body('password', 'Please enter a valiPlease enter a password of at least 5 characters and with only numbers and text')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()

        ,

        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Both password field must match');
                }
                return true;
            })



    ], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;