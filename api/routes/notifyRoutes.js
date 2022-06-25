const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const notifyController = require('../controllers/notifyController');

router.get('/notifies/:username/:notifyfor/:status', notifyController.getNotifies);
router.get('/retailernotifies/:username/:notifyfor/:status', notifyController.getRetailerNotifies);
router.get('/ordernotifies/:notifyfor/:owner/:role', notifyController.getOrderNotifies);
router.get('/orderretailernotifies/:notifyfor/:owner/:role', notifyController.getOrderRetailerNotifies);

router.get('/warehousenotifies/:notifyfor/:status', notifyController.getWarehouseNotifies);
router.get('/notifylist/:notifyfor', notifyController.getNotifyList);

router.get('/checknotify/:orderId/:status/:number', notifyController.checkNotify);
router.get('/checkOrderOperationNotify/:orderId/:status/:number', notifyController.checkOrderOperationNotify);

module.exports = router;