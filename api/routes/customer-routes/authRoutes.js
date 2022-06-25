const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const User = require('../../models/individualCustomer');
const authController = require('../../controllers/customer-controllers/individualCustomerController.js');


router.post('/signup', [

    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail address already exists');
                }
            })
        })
        .normalizeEmail({ gmail_remove_dots: false }),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),

],
    authController.signup
);

router.post('/login', authController.login);

router.post('/activate', authController.activate);

router.put('/uploadDocumentImage/:registerId', authController.putUploadDocumentImage);






module.exports = router;