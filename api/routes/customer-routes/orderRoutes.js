const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../../controllers/customer-controllers/orderController');
const isAuth = require('../../middleware/is-auth');


router.get('/myorders/:customerId/:pageNumber/:pageSize', orderController.getMyOrders);
router.get('/getagreement/:orderId', orderController.getAgreement);
router.get('/myordersmobil/:customerId/:pageNumber/:pageSize', orderController.getMyOrdersForMobil);
router.get('/myorderproductsmobil/:orderId', orderController.getMyOrderProductsForMobil);

router.get('/orders', orderController.getOrders);
router.get('/monthlyrevenue', orderController.getMonthlyRevenue);
router.get('/detailreport', orderController.getDetailReport);
router.get('/ordersforwarehouse', orderController.getOrdersForWarehouse);
router.get('/dashboard-list',isAuth, orderController.getDashboardOrders);
router.get('/ordergroupforproducts', orderController.getOrderGroupForProducts);
router.post('/approveThis', orderController.approveThis);
router.post('/warehouseApproveThis', orderController.warehouseApproveThis);
router.get('/orders/:orderId', orderController.getOrder);
router.get('/ordersforwarehouse/:orderId', orderController.getOrderForWarehouse);
router.get('/dashboard/:status', orderController.dashboard);
router.post('/poststatus', orderController.postStatus);
router.post('/orderproducttransaction', orderController.postOrderProductTransaction);
router.get('/orderproductstatus/:_id/:orderId/:productId/:orderProductNumber/:quantityInBox', orderController.orderProductStatus);
router.post('/updatecargoinformation', orderController.updateCargoInformation)
router.post('/changeproductstock', orderController.postChangeProductStock);
router.post('/operation', orderController.operation);
router.post('/canceled', orderController.postCanceled);
router.get('/ordercancel/:orderId/:userName', orderController.orderCancel);
router.post('/ordercustomercancel', orderController.orderCustomerCancel);


module.exports = router;