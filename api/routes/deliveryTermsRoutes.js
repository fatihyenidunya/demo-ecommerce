const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const deliveryTermsController = require('../controllers/deliveryTermsController');
const isAuth = require('../middleware/is-auth');

router.get('/list', deliveryTermsController.getDeliveryTerms);
router.get('/list/:deliveryTermId', deliveryTermsController.getDeliveryTerm);
router.post('/new', isAuth, deliveryTermsController.postAddDeliveryTerm);
router.put('/update/:deliveryTermId', isAuth, deliveryTermsController.putUpdateDeliveryTerm);
router.delete('/delete/:deliveryTermId', isAuth, deliveryTermsController.deleteDeliveryTerm);
module.exports = router;