const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const customerController = require('../controllers/customerController');
const isAuth = require('../middleware/is-auth');

router.get('/list', isAuth, customerController.getCustomers);
router.get('/list/:customerId', isAuth, customerController.getCustomer);


router.post('/signup', isAuth, customerController.addCustomer);

router.put('/update/:customerId', isAuth, customerController.putUpdateCustomer);
router.delete('/delete/:customerId', isAuth, customerController.deleteCustomer);
router.post('/login', customerController.login);

router.get('/changecustomerowner/:customerId/:username', isAuth, customerController.getChangeCustomerOwner);
router.get('/customerproductprices/:customerId', isAuth, customerController.getCustomerProductPrices);
router.get('/productsByTopCategoryForDealer/:customerId/:topCategory', customerController.getProductsByTopCategoryForDealer);
router.get('/customerproductcurrency/:customerId/:currency', isAuth, customerController.getCustomerProductCurrency);
router.get('/updatecustomerproductprice/:customerId/:_id/:unitPrice/:currency', isAuth, customerController.updatecustomerproductprice);
router.get('/products/:customerId', customerController.getProducts);
router.get('/products/:customerId/:productId', customerController.getProduct);
router.get('/basketproducts/:customerId', customerController.getBasketProducts);
router.post('/addtobasket', customerController.addToBasket);
router.get('/showbasket/:customerId', customerController.getShowBasket);
router.delete('/outofbasket/:customerId/:productId', customerController.outofbasket);
router.get('/myorders/:customerId/:pageNumber/:pageSize', customerController.getMyOrders);

router.post('/addcustomerproduct', isAuth, customerController.addCustomerProduct);
router.delete('/deletecustomerproduct/:id', customerController.deleteCustomerProduct);

router.post('/newAddress', isAuth, customerController.newAddress);
router.get('/getCustomerAddress/:addressId', customerController.getCustomerAddress);
router.get('/getCustomerAddresses/:customerId', customerController.getCustomerAddresses);
router.put('/deleteCustomerAddress/:id', isAuth, customerController.deleteCustomerAddress);
router.put('/updateCustomerAddress/:id', isAuth, customerController.updateCustomerAddress);


module.exports = router;

// , [
//     body('email')
//         .isEmail()
//         .withMessage('Please enter valid email')
//         .custom((value, { req }) => {
//             return Customer.findOne({ email: value }).then(customerDoc => {
//                 if (customerDoc) {
//                     return Promise.reject('E-mail address already exists');
//                 }
//             })
//         })
//         .normalizeEmail(),
//     body('password').trim().isLength({ min: 5 }),
//     body('company').trim().not().isEmpty(),
// ]