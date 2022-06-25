const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../../controllers/customer-controllers/cartController');



router.get('/list/:customerId', cartController.getCart);
router.post('/addtocart', cartController.addToCart);
router.get('/delete/:customerId/:cartId', cartController.outOfCart);
router.put('/updatecart/:customerId/:cartId', cartController.updateCart);
router.post('/giveanorder', cartController.postGiveAnOrder);
router.post('/giveanordermobile', cartController.postGiveAnOrderMobile);

module.exports = router;

