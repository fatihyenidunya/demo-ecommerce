const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const shipmentController = require('../controllers/shipmentController');
const isAuth = require('../middleware/is-auth');

router.get('/order/:id', shipmentController.getOrder);
router.get('/getshipmentdetail/:id', shipmentController.getShipmentDetail);
router.get('/getshipmentdetailbyorderid/:orderId', shipmentController.getShipmentDetailByOrderId);
router.get('/shipments', isAuth, shipmentController.getShipmentDetails);
router.post('/postshipmentdetail', isAuth, shipmentController.postShipmentDetail);
router.get('/getxcel/:orderId/:customerId', shipmentController.getXcel);

module.exports = router;