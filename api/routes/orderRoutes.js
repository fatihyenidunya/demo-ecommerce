const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const isAuth = require('../middleware/is-auth');

router.post('/giveanorder', orderController.postGiveAnOrder);
router.get('/myorders/:customerId/:pageNumber/:pageSize', orderController.getMyOrders);
router.get('/myordersmobil/:customerId/:pageNumber/:pageSize', orderController.getMyOrdersForMobil);
router.get('/myorderproductsmobil/:orderId', orderController.getMyOrderProductsForMobil);
router.get('/makepdf/:orderId/:customerId', orderController.getMakePdf);
router.get('/getpdf/:orderId/:customerId', orderController.getPdf);
router.get('/orders',isAuth, orderController.getOrders);
router.get('/ordersforwarehouse',isAuth, orderController.getOrdersForWarehouse);
router.get('/ordergroupforproducts/:username/:userrole',isAuth, orderController.getOrderGroupForProducts);
router.post('/approveThis', orderController.approveThis);
router.post('/warehouseapproveThis', orderController.warehouseApproveThis);
router.get('/orders/:orderId',isAuth, orderController.getOrder);
router.get('/warehouseorders/:orderId',isAuth, orderController.warehouseGetOrder);
router.get('/changeorderowner/:orderId/:username',isAuth, orderController.getChangeOrderOwner);
router.get('/ordersafteraddon/:orderId',isAuth, orderController.getOrderAfterAddon);
router.get('/dashboard/:status',isAuth, orderController.dashboard);
router.put('/savepromotion/:username/:orderId',isAuth, orderController.savePromotion);
router.put('/updatebillingaddress/:orderId', orderController.updateBillingAddress);
router.put('/updatedeliveryaddress/:orderId',orderController.updateDeliveryAddress);
router.get('/promotionproducts/:orderId',isAuth, orderController.getPromotionProducts);
router.get('/changeestimateddate/:orderId/:day/:month/:year',isAuth, orderController.changeEstimatedDate);
router.delete('/deletefreeproduct/:id/:username/:customerid/:customer/:country',isAuth, orderController.deletePromotionProducts);
router.delete('/deletePromotionProductsGiveBackToStock/:id/:username/:customerid/:customer/:country',isAuth, orderController.deletePromotionProductsGiveBackToStock);
router.get('/promotionProductAddedByWarehouse/:id/:username/:customerid/:customer/:country',isAuth, orderController.promotionProductAddedByWarehouse);
router.post('/addproducttoorder/:customerId/:orderId', orderController.addProductToOrder);
router.post('/poststatus', orderController.postStatus);
router.post('/orderproducttransaction', orderController.postOrderProductTransaction);
router.get('/orderproductstatus/:_id/:orderId/:productId/:orderProductNumber/:quantityInBox', orderController.orderProductStatus);
router.post('/postshipmentdetail', orderController.postShipmentDetail);
router.post('/changeproductstock', orderController.postChangeProductStock);

router.post('/operation', orderController.operation);
router.post('/warehouseoperation', orderController.warehouseOperation);
router.post('/warehouseretaileroperation', orderController.warehouseRetailerOperation);
router.post('/canceled', orderController.postCanceled);
router.put('/assignAddressToCustomer/:orderId/:whatfor',isAuth, orderController.assignAddressToCustomer);
router.get('/undo/:orderId/:productId/:userName', orderController.undo);
router.get('/ordercancel/:orderId/:userName', orderController.orderCancel);
router.get('/getshipmentdetail/:orderId', orderController.getShipmentDetail);


module.exports = router;