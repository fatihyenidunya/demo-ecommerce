const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../../controllers/customer-controllers/paymentController');


router.post('/payment', paymentController.postPayment);
router.get('/payments', paymentController.getPayments);
router.get('/payment/:paymentId', paymentController.getPayment);
router.post('/iyzicoinstallmentchecking', paymentController.iyzicoInstallmentChecking);
router.post('/iyzicopayment', paymentController.iyzicoPayment);
router.post('/iyzicocancel', paymentController.iyzicoCancel);
router.post('/iyzicorefund', paymentController.iyzicoRefund);
router.post('/savesale', paymentController.saveSales);

module.exports = router;

