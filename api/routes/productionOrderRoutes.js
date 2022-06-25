const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productionOrderController = require('../controllers/productionOrderController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, productionOrderController.getProductionOrders);
router.get('/getCompanyProductionOrder',isAuth, productionOrderController.getCompanyProductionOrder);
router.get('/getFindProductionOrder',isAuth, productionOrderController.getFindProductionOrder);
router.get('/list/:productionOrderId',isAuth, productionOrderController.getProductionOrder);
router.post('/new',isAuth, productionOrderController.postAddProductionOrder);
router.put('/update/:productionOrderId',isAuth, productionOrderController.putUpdateProductionOrder);
router.put('/finish/:productionOrderId',isAuth, productionOrderController.putFinishProductionOrder);
router.put('/canceled/:productionOrderId',isAuth, productionOrderController.putCanceledProductionOrder);
router.delete('/delete/:productionOrderId',isAuth, productionOrderController.deleteProductionOrder);


module.exports = router;