const mongodb = require('mongodb');
const OrderTransaction = require('../../models/orderTransaction');
const OrderRetailTransaction = require('../../models/orderRetailTransaction');
const Payment = require('../../models/payment');
const OrderProductTransaction = require('../../models/orderProductTransaction');
const OrderProductRetailerTransaction = require('../../models/orderProductRetailerTransaction');
const Order = require('../../models/orderRetail');
const WareHouseNotify = require('../../models/wareHouseNotify');
const ProductShipmentLog = require('../../models/productShipmentLog');
const OrderNotify = require('../../models/orderNotify');
const Transporter = require('../../models/transporter');
const OrderSearch = require('../../models/orderSearch');
const DetailReport = require('../../models/detailReport');
const Custom = require('../../models/custom');
const Product = require('../../models/product');
const OrderProduct = require('../../models/orderProduct');
const Email = require('../../models/email');
const OrderAgreement = require('../../models/orderAgreement');

const NotificationEmail = require('../../models/notificationEmail');
const nodemailer = require('nodemailer');
const io = require('../../socket');
// const { networkInterfaces } = require('os');
const orderStatus = require('../../classes/orderStatus');
const baseUrl = require('../../classes/baseUrl');
const errorService = require('../../classes/errorService');

totalBoxes = 0;
totalPieces = 0;
grandTotal = 0;
totalNetWeight = 0;
totalGrossWeight = 0;
totalM3 = 0;

const ObjectId = mongodb.ObjectId;

productCategories = [];

orderForProducts = {
    productId: '',
    title: '',
    imageUrl: '',
    unit: 0,
    box: 0,
    grandTotal: 0,
    currency: '',
    orders: [
    ]
}


exports.getMyOrders = async (req, res, next) => {
    const customerId = req.params.customerId


    const currentPage = Number(req.params.pageNumber) || 1;
    const perPage = Number(req.params.pageSize);
    let totalItems;


    try {

        totalItems = await Order.find({ 'customerId': customerId }).countDocuments();
        const orders = await Order
            .find({ 'customerId': customerId })
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });

    


        res.status(200).json({
            message: 'Fetched customer  products succesfully',
            orders: orders,
            orderDate: orders.createdAt,
            basketItems: orders.basketItems,
            totalOrders: totalItems

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getMyOrders',52,500,err);

        next(err);
    }

}

exports.getAgreement = async (req, res, next) => {
    const orderId = req.params.orderId





    try {


        const agreement = await OrderAgreement
            .find({ 'orderId': orderId });



        res.status(200).json(agreement[0].agreement


        )

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getAgreement',92,500,err);

        next(err);
    }

}

exports.getMyOrdersForMobil = async (req, res, next) => {
    const customerId = req.params.customerId

    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        const orders = await Order
            .find({ 'customerId': customerId })
            .exec()

        // .skip((currentPage - 1) * perPage)
        // .limit(perPage).sort({ orderDate: -1 });



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            orders: orders,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getMyOrdersForMobil',123,500,err);
        next(err);
    }

}

exports.getMyOrderProductsForMobil = async (req, res, next) => {
    const orderId = req.params.orderId

    let totalItems;

    try {

        const orderProducts = await OrderProduct
            .find({ 'order': orderId })
            .exec()




        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            orderProducts: orderProducts,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getMyOrderProductsForMobil',157,500,err);
        next(err);
    }

}


exports.getOrders = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    const status = req.query.status || orderStatus.PendingApproval;
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';


    let totalItems = 40;


    let perPage = Number(pageSize);


    let queryTxt = "";
    let customerTxt = "";
    let statusTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (customer != '') {
        if (customer != 'undefined') {
            customerTxt = '"customer":{ "\$regex" : "' + customer + '", "\$options" : "i"},';
        }
    }

    if (status != 'Hepsi') {
        if (status != 'undefined') {
            statusTxt = '"status":"' + status + '",';

        }
    }

    queryTxt = '{' + customerTxt + statusTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);





    try {
        const items = await Order.find(query).countDocuments();

        const orders = await Order
            .find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            orders: orders,
            totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getOrders',188,500,err);

        next(err);
    }

}


exports.getMonthlyRevenue = async (req, res, next) => {

    const month = req.query.month;
    const lastDay = req.query.lastDay;
    const year = req.query.year;

    let startDate;
    let endDate;


    let queryTxt = "";

    if (month != 0) {
        startDate = new Date(year + "-" + month + "-" + "1");
        endDate = new Date(year + "-" + month + "-" + lastDay);
    } else {
        startDate = new Date(year + "-" + "1" + "-" + "1");
        endDate = new Date(year + "-" + "12" + "-" + "31");
    }

    queryTxt = '{"createdAt": { "\$gte": "' + startDate + '", "\$lte":"' + endDate + '"}}';  
    let query = JSON.parse(queryTxt);

    try {

        let revenue = 0;

        const orders = await Order
            .find(query);

        for (let r of orders) {
            revenue += Number(r.grandTotal);
        }


        res.status(200).json({
            message: 'Fetched revenue succesfully',
            revenue: revenue,


        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getMonthlyRevenue',266,500,err);
        next(err);
    }

}


// exports.getDetailReport = async (req, res, next) => {


//     const type = req.query.type;
//     const month = req.query.month;
//     const lastDay = req.query.lastDay;
//     const year = req.query.year;
//     const monthNumber = req.query.monthNumber;
//     const email = req.query.email;

//     let revenue = 0;
//     let currency = '';
//     let productNumber = 0;
//     let startDate;
//     let endDate;





//     let queryTxt = "";

//     if (type != 'Yillik') {

//         startDate = new Date(year + "-" + monthNumber + "-" + "1");
//         endDate = new Date(year + "-" + monthNumber + "-" + lastDay);
//     } else {

//         startDate = new Date(year + "-" + "1" + "-" + "1");
//         endDate = new Date(year + "-" + "12" + "-" + "31");
//     }



//     queryTxt = '{"createdAt": { "\$gte": "' + startDate + '", "\$lte":"' + endDate + '"}}';

//     let query = JSON.parse(queryTxt);

//     try {


//         await DetailReport.deleteMany({});

//         const __products = await Product.find();

//         __products.forEach(p => {
//             detailReportProduct = new DetailReport({
//                 productId: p._id,
//                 title: p.title,
//                 volume: p.volume,
//                 volumeEntity: p.volumeEntity,
//                 imageUrl: p.image[0],
//                 stock: p.stock


//             });

//             detailReportProduct.save();

//         })



//         const orders = await Order
//             .find(query);


//         for (let product of __products) {

//             unitInOrder = 0;
//             boxInOrder = 0;
//             _totalUnit = 0;
//             _totalBox = 0;
//             _totalGranTotal = 0;
//             _currency = '';
//             totalPrice = 0;

//             productNumber += 1;


//             for (let order of orders) {

//                 for (let o of order.products) {
//                     if (o.product._id == product._id) {
//                         _totalUnit += o.unit;
//                         _totalGranTotal += o.totalPrice;
//                         totalPrice = o.totalPrice;
//                         unitInOrder = o.unit;
//                         _currency = order.currency;

//                     }
//                 }

//             }

//             const prod = await DetailReport.find({ 'productId': product._id });

//             revenue += Number(_totalGranTotal.toFixed(2));
//             currency += prod[0].currency;

//             prod[0].unit = _totalUnit;
//             prod[0].grandTotal = _totalGranTotal.toFixed(2);
//             prod[0].currency = _currency;
//             prod[0].save();




//         }

//         const detailReportProducts = await DetailReport.find().sort({ unit: -1 });




//         sendDetailReportMail(type, year, month, email, productNumber, detailReportProducts, revenue, currency);


//         res.status(200).json({
//             message: 'Fetched revenue succesfully'

//         })

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }

// }


exports.getDetailReport = async (req, res, next) => {


    const type = req.query.type;
    const month = req.query.month;
    const lastDay = req.query.lastDay;
    const year = req.query.year;
    const monthNumber = req.query.monthNumber;
    const email = req.query.email;

    let revenue = 0;
    let currency = '';
    let productNumber = 0;
    let startDate;
    let endDate;

    let _stock = 0;




    let queryTxt = "";

    if (type != 'Yillik') {

        startDate = new Date(year + "-" + monthNumber + "-" + "1");
        endDate = new Date(year + "-" + monthNumber + "-" + lastDay);
    } else {

        startDate = new Date(year + "-" + "1" + "-" + "1");
        endDate = new Date(year + "-" + "12" + "-" + "31");
    }



    queryTxt = '{"createdAt": { "\$gte": "' + startDate + '", "\$lte":"' + endDate + '"},"status":"' + orderStatus.ShipmentSuccessed + '"}';

    let query = JSON.parse(queryTxt);

    try {


        await DetailReport.deleteMany({});

        const orders = await Order
            .find(query);




        for (let order of orders) {

            for (let _product of order.products) {

                currency = _product.currency;

                const detailReport = await DetailReport.find({ productId: _product.product._id, stockCode: _product.stockCode });


                if (detailReport.length == 0) {

                    const __product = await Product.findById(_product.product._id);

                    if (__product.colors.length != 0) {

                        for (let p of __product.colors) {

                            if (p.stockCode == _product.stockCode) {
                                _stock = 0;
                                _stock = p.stock;

                            }


                        }


                    }

                    if (__product.sizes.length != 0) {

                        for (let p of __product.sizes) {

                            if (p.stockCode == _product.stockCode) {
                                _stock = 0;
                                _stock = p.stock;

                            }


                        }
                    }

                    detailReportProduct = new DetailReport({
                        productId: _product.product._id,
                        title: _product.productTitle,
                        stockCode: _product.stockCode,
                        volume: _product.volume,
                        volumeEntity: _product.volumeEntity,
                        imageUrl: _product.product.image[0],
                        currency: _product.currency,
                        unit: _product.unit,
                        grandTotal: _product.totalPrice,
                        stock: _stock

                    });
                    await detailReportProduct.save();
                    revenue += _product.totalPrice;

                    productNumber += 1;
                } else {


                    const _detailReport = await DetailReport.find({ productId: _product.product._id, stockCode: _product.stockCode });



                    _detailReport[0].unit += _product.unit;
                    _detailReport[0].grandTotal += _product.totalPrice;

                    await _detailReport[0].save();

                    revenue += _product.totalPrice;
                }

            }

        }


        const __products = await Product.find();

        for (let __pro of __products) {

            if (__pro.colors.length != 0) {

                for (let p of __pro.colors) {



                    const _detailReport = await DetailReport.find({ productId: __pro._id, stockCode: p.stockCode });


                    if (_detailReport.length == 0) {

                        __detailReportProduct = new DetailReport({
                            productId: __pro._id,
                            title: __pro.title + ' - ' + p.color,
                            stockCode: p.stockCode,
                            volume: p.volume,
                            volumeEntity: p.volumeEntity,
                            imageUrl: __pro.image[0],
                            currency: p.currency,
                            unit: 0,
                            grandTotal: 0,
                            stock: p.stock

                        });
                        await __detailReportProduct.save();


                    }
                }
            }


            if (__pro.sizes.length != 0) {
                for (let p of __pro.sizes) {

                    const _detailReport = await DetailReport.find({ productId: __pro._id, stockCode: p.stockCode });


                    if (_detailReport.length == 0) {

                        __detailReportProduct = new DetailReport({
                            productId: __pro._id,
                            title: __pro.title,
                            stockCode: p.stockCode,
                            volume: p.volume,
                            volumeEntity: p.volumeEntity,
                            imageUrl: __pro.image[0],
                            currency: p.currency,
                            unit: 0,
                            grandTotal: 0,
                            stock: p.stock

                        });
                        await __detailReportProduct.save();


                    }

                }
            }
        }



        const detailReportProducts = await DetailReport.find().sort({ unit: -1 });

        sendDetailReportMail(type, year, month, email, productNumber, detailReportProducts, revenue, currency);


        res.status(200).json({
            message: 'Fetched revenue succesfully'

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getDetailReport',452,500,err);

        next(err);
    }

}


exports.getOrdersForWarehouse = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    const status = req.query.status || orderStatus.PendingApproval;
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';


    let totalItems = 40;


    let perPage = Number(pageSize);


    let queryTxt = "";
    let customerTxt = "";

    let statusTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (customer != '') {
        if (customer != 'undefined') {
            customerTxt = '"customer":{ "\$regex" : "' + customer + '", "\$options" : "i"},';
        }
    }

    if (status != 'Hepsi') {
        if (status != 'undefined') {
            statusTxt = '"status":"' + status + '",';

        }
    } else {
        statusTxt = '"status":{ "\$ne" : "' + orderStatus.PendingApproval + '"},';

    }

    queryTxt = '{' + customerTxt + statusTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);





    try {
        const items = await Order.find(query).countDocuments();

        const orders = await Order
            .find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            orders: orders,
            totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getOrdersForWarehouse',672,500,err);
        next(err);
    }

}

exports.getDashboardOrders = async (req, res, next) => {


    try {

        const orders = await Order
            .find({ 'status': orderStatus.PendingApproval })
            .sort({ createdAt: -1 })
            .limit(10);


        res.status(200).json({
            message: 'Fetched orders succesfully',
            orders: orders

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getDashboardOrders',752,500,err);
        next(err);
    }

}


exports.getOrderGroupForProducts = async (req, res, next) => {


    try {


        await OrderSearch.deleteMany({});

        const __products = await Product.find();


        __products.forEach(p => {
            orderSearchProduct = new OrderSearch({
                productId: p._id,
                title: p.title,
                imageUrl: p.image[0],
                stock: p.stock
            });

            orderSearchProduct.save();

        })

        const orders = await Order.find()


        for (let product of __products) {

            unitInOrder = 0;
            // boxInOrder = 0;
            _totalUnit = 0;
            // _totalBox = 0;
            _totalGranTotal = 0;
            _currency = '';
            totalPrice = 0;


            for (let order of orders) {
                let found = false;

                for (let o of order.products) {
                    if (o.product._id == product._id) {
                        _totalUnit += o.unit;
                        // _totalBox += o.box;
                        _totalGranTotal += o.totalPrice;
                        totalPrice = o.totalPrice;
                        unitInOrder = o.unit;
                        // boxInOrder = o.box;
                        _currency = order.currency;
                        found = true;

                    }
                }


                if (found == true) {

                    const _prod = await OrderSearch.find({ 'productId': product._id });

                    let newOrder = {
                        orderId: order._id,
                        status: order.status,
                        customer: order.customer,
                        country: order.billing[0].BILL_COUNTRYCODE,
                        totalPrice: totalPrice,
                        currency: order.currency,
                        unit: unitInOrder,
                        // box: boxInOrder,
                        createdAt: order.createdAt
                    }



                    _prod[0].orders.push(newOrder);
                    _prod[0].save();
                }


            }

            const prod = await OrderSearch.find({ 'productId': product._id });



            prod[0].unit = _totalUnit;
            // prod[0].box = _totalBox;
            prod[0].grandTotal = _totalGranTotal;
            prod[0].currency = _currency;
            prod[0].save();




        }

        const orderForProducts = await OrderSearch.find();


        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            orders: orderForProducts
            // totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getOrderGroupForProducts',780,500,err);

        next(err);
    }

}

exports.warehouseApproveThis = async (req, res, next) => {



    const orderId = ObjectId(req.body.orderId);
    const userName = req.body.userName;
    const status = req.body.status;

    try {

        const order = await Order.findById(orderId);

        order.isApproved = true;
        order.userName = userName;
        order.status = status;


        const result = await order.save();


        const orderRetailTransaction = new OrderRetailTransaction({
            orderId: orderId,
            isApproved: true,
            status: status,
            userName: userName
        });


        await orderRetailTransaction.save();



        if (status == orderStatus.PendingApproval) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'customer'

            });

            await newOrderNotify.save();
            // newOrderNotify.createdAt = Date.now;

        }

        if (status == orderStatus.GettingReady) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'customer'

            });

            await newOrderNotify.save();


            const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
            const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });
        }


        if (status == orderStatus.ShipmentSuccessed) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'customer'

            });

            await newOrderNotify.save();


            const partnetEmail = await NotificationEmail.find({ whose: 'Ahmet Topçu' });



            sendOrderApprovationMail(order.delivery[0].email, order, orderStatus.ShipmentSuccessed);
            sendOrderNotificationMail(partnetEmail[0].email, order, orderStatus.ShipmentSuccessed);

            for (let p of result.products) {


                const productShipmentLog = new ProductShipmentLog({
                    orderId: orderId,
                    customerId: result.customerId,
                    customer: result.customer,
                    country: result.delivery[0].countryCode,
                    status: status,
                    productId: p.product._id,
                    title: p.product.title + '-' + p.product.volume + p.product.volumeEntity,
                    shipmentNumber: p.readyUnitNumber,
                    orderNumber: p.unit,
                    userName: userName,

                });



                await productShipmentLog.save();

            }






            const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
            const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });
        }




        // if (status == 'Order Approved') {

        //     const order = await Order.findById(orderId);
        //     for (let p of order.products) {


        //         const product = await Product.findById({ _id: p.product._id });
        //         product.virtualStock -= p.unit;
        //         await product.save();

        //     };




        //     const notify = await OrderNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

        //     if (notify[0]) {

        //         const checkedDate = Date.now;
        //         await OrderNotify.updateOne({ _id: notify[0]._id }, { status: 'Order Approved', isChecked: true });
        //     }
        //     io.addNamespace('/customer-orders').emit('updateNotifyCustomer', { updateNotify: true });



        //     const wareHouseNotify = new WareHouseNotify({
        //         orderId: orderId,
        //         customerId: result.customerId,
        //         customer: result.customer,
        //         country: result.country,
        //         status: status,
        //         number: 2,
        //         notifyFor: 'customer'

        //     });

        //     await wareHouseNotify.save();

        //     const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
        //     const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


        //     io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });
        // }

        // if (status == 'Canceled Approved') {

        //     const wareHouseNotify = new WareHouseNotify({
        //         orderId: orderId,
        //         customerId: result.customerId,
        //         customer: result.customer,
        //         country: result.country,
        //         status: status,
        //         number: 11,
        //         notifyFor: 'customer'

        //     });

        //     await wareHouseNotify.save();

        //     const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
        //     const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);

        //     io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        // }


        if (status == orderStatus.OrderCanceled) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'customer'

            });

            await newOrderNotify.save();
            // newOrderNotify.createdAt = Date.now;

            const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
            const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });


        }


        res.status(200).json({
            message: status,


        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','warehouseApproveThis',896,500,err);
        next(err);
    }

}

exports.updateCargoInformation = async (req, res, next) => {





    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {

        const orderId = req.body.orderId;
        const cargoCompany = req.body.cargoCompany;
        const trackingCode = req.body.trackingCode;

        let currentDate = new Date();

        let order = await Order.findById(orderId);

        order.cargoCompany = cargoCompany;
        order.trackingCode = trackingCode;
        order.shipmentDate = currentDate;
        const result = await order.save();

        res.status(201).json({ statusCode: 201, message: 'Tracking Code has been updated ', order: result });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','updateCargoInformation',1146,500,err);
        next(err);
    }
};


exports.approveThis = async (req, res, next) => {



    const orderId = ObjectId(req.body.orderId);
    const userName = req.body.userName;
    const status = req.body.status;

    try {

        const order = await Order.findById(orderId);

        order.isApproved = true;
        order.userName = userName;
        order.status = status;


        const result = await order.save();


        const orderRetailTransaction = new OrderRetailTransaction({
            orderId: orderId,
            isApproved: true,
            status: status,
            userName: userName
        });


        await orderRetailTransaction.save();

        const orderRetailTransactions = await OrderRetailTransaction.find({ orderId: orderId }).sort({ createdAt: -1 });


        if (status == orderStatus.PendingApproval) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                number: 1,
                country: result.country,
                status: status,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'customer'

            });

            await newOrderNotify.save();
            // newOrderNotify.createdAt = Date.now;

        }

        if (status == orderStatus.GettingReady) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 2,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'customer'

            });

            await newOrderNotify.save();


            const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
            const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });
        }


        if (status == orderStatus.ShipmentSuccessed) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 3,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'customer'

            });

            await newOrderNotify.save();


            const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
            const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);




            io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });
        }




        if (status == orderStatus.OrderApproved) {

            const order = await Order.findById(orderId);
            for (let p of order.products) {


                const product = await Product.findById({ _id: p.product._id });
                product.virtualStock -= p.unit;
                await product.save();

            };


            let _emails = '';

            const emails = await NotificationEmail.find({ whatFor: 'NewOrder' });

            for (let email of emails) {

                _emails = email + ',';
            }




            sendOrderApprovationMail(order.delivery[0].email, order, orderStatus.OrderApproved);
            sendOrderNotificationMail(emails, order, orderStatus.OrderApproved);

            // const notify = await OrderNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // if (notify[0]) {

            //     const checkedDate = Date.now;
            //     await OrderNotify.updateOne({ _id: notify[0]._id }, { status: 'Order Approved', isChecked: true });
            // }
            // io.addNamespace('/customer-orders').emit('updateNotifyCustomer', { updateNotify: true });



            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 2,
                notifyFor: 'customer'

            });

            await wareHouseNotify.save();

            const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
            const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse-retailer').emit('updateNotifyRetailerWarehouse', { status: status, notifies: notifies, unSeenCount: unSeenCount });
        }


        if (status == orderStatus.CanceledApproved) {




            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 6,
                notifyFor: 'customer'

            });

            await wareHouseNotify.save();

            const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
            const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse-retailer').emit('updateNotifyRetailerWarehouse', { status: status, notifies: notifies, unSeenCount: unSeenCount });
        }

        // if (status == 'Canceled Approved') {

        //     const wareHouseNotify = new WareHouseNotify({
        //         orderId: orderId,
        //         customerId: result.customerId,
        //         customer: result.customer,
        //         country: result.country,
        //         status: status,
        //         number: 11,
        //         notifyFor: 'customer'

        //     });

        //     await wareHouseNotify.save();

        //     const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
        //     const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);

        //     io.addNamespace('/customer-operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        // }


        // if (status == 'Order Canceled') {

        //     const newOrderNotify = new OrderNotify({
        //         orderId: orderId,
        //         customerId: result.customerId,
        //         customer: result.customer,
        //         country: result.country,
        //         status: status,
        //         grandTotal: result.grandTotal,
        //         currency: result.currency,
        //         notifyFor: 'customer'

        //     });

        //     await newOrderNotify.save();
        //     // newOrderNotify.createdAt = Date.now;

        // }


        res.status(200).json({
            message: status,
            orderRetailTransactions: orderRetailTransactions

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','approveThis',1187,500,err);
        next(err);
    }

}

exports.getOrder = async (req, res, next) => {
    const orderId = ObjectId(req.params.orderId);


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;



    try {

        const order = await Order
            .find({ '_id': orderId })
            .exec();


        for (let p of order[0].products) {

            let _product = await Product.find({ _id: ObjectId(p.product._id) });

            if (_product[0].colors.length != 0) {

                for (let color of _product[0].colors) {
                    if (color.stockCode === p.stockCode) {
                        p.stock = color.stock;
                    }

                }

            }

            if (_product[0].sizes.length != 0) {

                for (let size of _product[0].sizes) {
                    if (size.stockCode === p.stockCode) {
                        p.stock = size.stock;
                    }

                }

            }

        }

        const orderRetailTransactions = await OrderRetailTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });


        const orderRetailerProductTransactions = await OrderProductRetailerTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });


        const notify = await OrderNotify.find({ 'orderId': orderId, isChecked: false });


        for (let n of notify) {

            const checkedDate = Date.now;
            const result = await OrderNotify.updateOne({ _id: n._id }, { isChecked: true }, { checkedDate: checkedDate });


        }

        // const _orderOperationNotify = await OrderOperationNotify.find({ 'orderId': orderId, $or: [{ number: { $eq: number } }, { number: { $lt: number } }] }).sort({ createdAt: -1 });

        // const checkedDate = Date.now;


        // for (let n of _orderOperationNotify) {

        //     const result1 = await OrderOperationNotify.updateOne({ _id: n._id }, { isChecked: true }, { checkedDate: checkedDate });

        // }



        io.addNamespace('/customer-orders').emit('updateNotifyCustomer', { updateNotify: true });

        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            order: order[0],
            orderRetailTransactions: orderRetailTransactions,
            orderRetailerProductTransactions: orderRetailerProductTransactions

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getOrder',1440,500,err);
        next(err);
    }

}


exports.getOrderForWarehouse = async (req, res, next) => {
    const orderId = ObjectId(req.params.orderId);


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;




    try {

        const order = await Order
            .find({ '_id': orderId })
            .exec();




        for (let p of order[0].products) {

            let _product = await Product.find({ _id: ObjectId(p.product._id) });

            if (_product[0].colors.length != 0) {

                for (let color of _product[0].colors) {
                    if (color.stockCode === p.stockCode) {
                        p.stock = color.stock;
                    }

                }

            }


            if (_product[0].sizes.length != 0) {

                for (let size of _product[0].sizes) {
                    if (size.stockCode === p.stockCode) {
                        p.stock = size.stock;
                    }

                }

            }

        }


        const orderTransactions = await OrderTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });


        // const orderProductTransactions = await OrderProductTransaction
        //     .find({ 'orderId': orderId }).sort({ createdAt: -1 });



        const notify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });



        if (notify[0]) {

            const checkedDate = Date.now;
            const result = await WareHouseNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });


        }


        io.addNamespace('/warehouse-retailer').emit('updateNotifyRetailerWarehouse', { updateNotify: true });

        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            order: order[0],
            orderTransactions: orderTransactions,
            // orderProductTransactions: orderProductTransactions

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','getOrderForWarehouse',1538,500,err);
        next(err);
    }

}

exports.dashboard = async (req, res, next) => {
    const status = req.params.status



    try {

        const totalItems = await Order
            .find({ 'status': status })
            .count();




        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            totalItems: totalItems,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','dashboard',1630,500,err);
        next(err);
    }

}

exports.postStatus = async (req, res, next) => {




    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {

        const orderTransaction = new OrderTransaction({
            orderId: req.body.orderId,
            status: req.body.status,
            userName: req.body.userName
        });

        const result = await orderTransaction.save();

        const results = await OrderTransaction.find({ orderId: result.orderId }).sort({ operationDate: -1 });


        let order = await Order.findById(result.orderId);
        order.status = result.status;
        await order.save();
        const orderStatus = result.status;

        let customs;
        let transporters;
        if (req.body.status === 'Shipped') {

            customs = await Custom.find();
            transporters = await Transporter.find()
        }

        customs = await Custom.find();


        res.status(201).json({
            statusCode: 201, message: 'Transaction created!',
            transactions: results,
            orderStatus: orderStatus, customs: customs, transporters: transporters
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','postStatus',1660,500,err);
        next(err);
    }
};





exports.postOrderProductTransaction = async (req, res, next) => {




    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {

        const orderProductTransaction = new OrderProductTransaction({
            orderId: req.body.orderId,
            productId: req.body.productId,
            imageUrl: req.body.imageUrl,
            product: req.body.productTitle,
            productNumber: req.body.newProductBoxNumber,
            operation: req.body.operation,
            userName: req.body.userName
        });

        const result = await orderProductTransaction.save();
        res.status(201).json({ statusCode: 201, message: 'Transaction created!', transactionId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','postOrderProductTransaction',1721,500,err);
        next(err);
    }
};

exports.operation = async (req, res, next) => {


    try {



        // const _id = req.body._id;
        const orderId = req.body.orderId;
        const productId = req.body.productId;
        const imageUrl = req.body.imageUrl;
        const product = req.body.productTitle;

        const operation = req.body.operation;
        const userName = req.body.userName;
        const newProductBoxNumber = req.body.newProductBoxNumber;
        const newProductNumber = Number(req.body.newProductBoxNumber) * Number(req.body.quantityInBox);
        const orderProductBoxNumber = req.body.orderProductBoxNumber;
        const quantityInBox = req.body.quantityInBox;

        // console.log("_id : " + _id)
        // console.log("orderId : " + orderId)
        // console.log("productId : " + productId)
        // console.log("imageUrl : " + imageUrl)
        // console.log("product : " + product)
        // console.log("newProductNumber : " + newProductNumber)
        // console.log("operation : " + operation)
        // console.log("userName : " + userName)
        // console.log("newProductBoxNumber : " + newProductBoxNumber)
        // console.log("orderProductBoxNumber : " + orderProductBoxNumber)
        // console.log("quantityInBox : " + quantityInBox)


        let _orderProductResult;

        let _orderProduct = await Order.find({ '_id': ObjectId(orderId) });

        console.log(_orderProduct)

        // let _product = await Product.findById(ObjectId(productId));

        // _orderProduct.stock = _product.stock;


        if (operation === 'Eklendi') {


            // _orderProduct.readyProductBoxNumber = Number(_orderProduct.readyProductBoxNumber) + Number(newProductBoxNumber);


            // _orderProduct.status = "Hazırlanıyor";
            // if (_orderProduct.readyProductBoxNumber === _orderProduct.box) {
            //     _orderProduct.status = "Tamamlandı";
            // }
            // _orderProduct.statusDate = Date.now();

            // _orderProduct.stock -= newProductNumber;

            // _product.stock -= newProductNumber;




        }
        if (operation === 'Cikarildi') {


            _orderProduct.readyProductBoxNumber = Number(_orderProduct.readyProductBoxNumber) - Number(newProductBoxNumber);
            _orderProduct.status = "Hazırlanıyor";
            if (_orderProduct.readyProductBoxNumber === 0) {
                _orderProduct.status = "Beklemede";
            }
            _orderProduct.statusDate = Date.now();
            _orderProduct.stock += newProductNumber;

            _product.stock += newProductNumber;

        }


        // await _product.save();
        // _orderProductResult = await _orderProduct.save();


        const orderProductTransaction = new OrderProductTransaction({
            orderId: req.body.orderId,
            productId: req.body.productId,
            imageUrl: req.body.imageUrl,
            product: req.body.productTitle,
            productNumber: req.body.newProductBoxNumber,
            operation: req.body.operation,
            userName: req.body.userName
        });

        // const result = await orderProductTransaction.save();

        const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ operationDate: -1 });



        res.status(201).json({
            statusCode: 201, message: 'Transaction created!',
            orderProduct: _orderProductResult,
            orderProductTransactions: orderProductTransactions
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','operation',1758,500,err);
        next(err);
    }
};

exports.postCanceled = async (req, res, next) => {




    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    let _orderProductResult;
    let _orderResult;
    try {

        const _id = req.body._id;
        const orderId = req.body.orderId;
        const productId = req.body.productId;
        const unit = req.body.unit;
        const unitPrice = req.body.unitPrice;
        const box = req.body.box;
        const orderDate = req.body.orderDate;
        const totalPrice = req.body.totalPrice;
        const currency = req.body.currency;
        const userName = req.body.userName;
        const operation = req.body.operation;
        const readyProductBoxNumber = req.body.readyProductBoxNumber;



        let unitNumber = unit;


        if (Number(readyProductBoxNumber) !== 0) {
            unitNumber = (unit / box) * readyProductBoxNumber;
        }



        let orderProduct = await OrderProduct.findById(_id);

        if (orderProduct) {

            let product = await Product.findById(ObjectId(productId));

            if (Number(readyProductBoxNumber) === 0) {
                product.stock = product.stock;
            }
            else {
                product.stock = product.stock + unitNumber;
            }


            let _product = await product.save();


            orderProduct.status = operation;
            orderProduct.canceled = true;
            orderProduct.stock = _product.stock;
            orderProduct.readyProductBoxNumber = 0;
            _orderProductResult = await orderProduct.save();



            let order = await Order.findById(ObjectId(orderId));
            order.grandTotal = order.grandTotal - totalPrice;
            order.totalProduct = order.totalProduct - unitNumber;



            _orderResult = await order.save()
            if (Number(readyProductBoxNumber) === 0) {
                unitNumber = box;
            }
            else {
                unitNumber = readyProductBoxNumber;
            }

            const orderProductTransaction = new OrderProductTransaction({
                orderId: orderId,
                productId: productId,
                imageUrl: product.imageUrl,
                product: product.title,
                productNumber: unitNumber,
                operation: operation,
                userName: userName,
                canceled: true
            });

            await orderProductTransaction.save();

        }

        const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ operationDate: -1 });


        res.status(201).json({
            statusCode: 201, message: 'Canceled!',
            orderProduct: _orderProductResult,
            orderResult: _orderResult,
            orderProductTransactions: orderProductTransactions
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','postCanceled',1873,500,err);
        next(err);
    }
};


exports.orderCancel = async (req, res, next) => {




    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }
    let productImageUrl;
    let productTitle;

    let _orderProductResult;
    let _orderResult;
    try {


        const orderId = req.params.orderId;
        const userName = req.params.userName;



        let order = await Order.findById(orderId);

        order.status = orderStatus.orderCanceled;

        for (const p of order.products) {

            let _product = await Product.findById(ObjectId(p.product._id));

            // p.stock = 0;   // this stock variable not shows current stock I am using it when I need it
            _product.stock += p.unit;
      
            await _product.save();



        }




        let oldOrder = await Order.findById(orderId);
        oldOrder = order;
        await oldOrder.save();



        let oldOrder2 = await Order.findById(orderId);
        oldOrder2.products = order.products;
        _orderProductResult = await oldOrder2.save();


        const orderTransaction = new OrderTransaction({
            orderId: orderId,
            isApproved: true,
            status: order.status,
            userName: userName
        });


        await orderTransaction.save();

        const orderTransactions = await OrderTransaction.find({ orderId: orderId }).sort({ createdAt: -1 });


        const newOrderNotify = new OrderNotify({
            orderId: orderId,
            customerId: order.customerId,
            customer: order.customer,
            country: order.billing[0].BILL_COUNTRYCODE,
            status: order.status,
            grandTotal: order.grandTotal,
            currency: order.currency,
            notifyFor: 'customer'

        });

        await newOrderNotify.save();


        console.log(newOrderNotify);


        const unSeenCount = await OrderNotify.find({ 'status': order.status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
        const notifies = await OrderNotify.find({ 'status': order.status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/customer-operations').emit('operation', { status: order.status, notifies: notifies, unSeenCount: unSeenCount });


        res.status(201).json({
            statusCode: 201, message: 'Canceled!',
            orderProduct: _orderProductResult,
            orderTransactions: orderTransactions

        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','orderCancel',1988,500,err);
        next(err);
    }
};

exports.orderCustomerCancel = async (req, res, next) => {




    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }
    let productImageUrl;
    let productTitle;

    let _orderProductResult;
    let _orderResult;
    try {


        const orderId = req.body.orderId;
        const customerName = req.body.customerName;
        const reason = req.body.reason;



        let order = await Order.findById(orderId);

        order.status = orderStatus.CanceledWanted;
        order.note = reason;

        await order.save();

        // for (const p of order.products) {

        //     let _product = await Product.findById(ObjectId(p.product._id));

        //     // p.stock = 0;   // this stock variable not shows current stock I am using it when I need it
        //     _product.stock += p.unit;
        //     console.log(_product.stock)
        //     await _product.save();



        // }




        // let oldOrder = await Order.findById(orderId);
        // oldOrder = order;
        // await oldOrder.save();



        // let oldOrder2 = await Order.findById(orderId);
        // oldOrder2.products = order.products;
        // _orderProductResult = await oldOrder2.save();


        const orderTransaction = new OrderTransaction({
            orderId: orderId,
            isApproved: true,
            status: order.status,
            userName: customerName
        });


        await orderTransaction.save();

        const orderTransactions = await OrderTransaction.find({ orderId: orderId }).sort({ createdAt: -1 });


        const newOrderNotify = new OrderNotify({
            orderId: orderId,
            customerId: order.customerId,
            customer: order.customer,
            country: order.countryCode,
            status: order.status,
            grandTotal: order.grandTotal,
            currency: order.currency,
            notifyFor: 'customer'

        });

        await newOrderNotify.save();


        console.log(newOrderNotify);


        const unSeenCount = await OrderNotify.find({ 'status': order.status, isChecked: false, 'notifyFor': 'customer' }).countDocuments();
        const notifies = await OrderNotify.find({ 'status': order.status, 'notifyFor': 'customer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/customer-operations').emit('operation', { status: order.status, notifies: notifies, unSeenCount: unSeenCount });


        res.status(201).json({
            statusCode: 201, message: 'Canceled!',
            orderProduct: _orderProductResult,
            orderTransactions: orderTransactions

        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','orderCustomerCancel',2098,500,err);
        next(err);
    }
};



exports.postChangeProductStock = async (req, res, next) => {





    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {

        const productId = req.body.productId;
        const itemNumber = req.body.itemNumber;
        const operation = req.body.operation;



        let product = await Product.findById(productId);

        if (!product) {
            const error = new Error('product couldnot be found');
            error.statusCode = 401;
            throw error;
        }

        if (operation === 'Eklendi') {
            product.stock = Number(product.stock) - Number(itemNumber);


        }


        if (operation === 'Cikarildi') {

            product.stock = Number(product.stock) + Number(itemNumber);


        }

        const result = await product.save();

        res.status(201).json({ statusCode: 201, message: 'Stock has been updated ', product: result });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','postChangeProductStock',2214,500,err);
        next(err);
    }
};

exports.orderProductStatus = async (req, res, next) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const orderProductBoxNumber = req.params.orderProductNumber;
    const quantityInBox = req.params.quantityInBox;
    const _id = req.params._id;


    addedProductNumber = 0;
    extractProductNumber = 0;


    try {

        await OrderProductTransaction
            .aggregate([{ $match: { 'orderId': { $eq: ObjectId(orderId) }, 'productId': { $eq: ObjectId(productId) }, 'canceled': { $eq: false } } }, { $group: { _id: '$operation', sum: { $sum: '$productNumber' } } }])
            .then(res => {

                res.forEach(e => {


                    if (e._id === 'Cikarildi') {
                        extractProductNumber = e.sum;
                    }
                    if (e._id === 'Eklendi') {
                        addedProductNumber = e.sum;
                    }

                })

            })


        result = addedProductNumber - extractProductNumber;

        let orderProduct = await OrderProduct.findById(_id);

        if (result < orderProductBoxNumber) {

            orderProduct.status = 'Hazırlanıyor';
        }
        if (result = orderProductBoxNumber) {
            orderProduct.status = 'Tamamlandı';
        }


        orderProduct.readyProductBoxNumber = result;
        orderProduct.stock = Number(orderProduct.stock) - (result * quantityInBox);
        const result1 = await orderProduct.save();




        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            readyProductBoxNumber: result,
            status: orderProduct.status,
            stock: orderProduct.stock


        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController','orderProductStatus',2271,500,err);
        next(err);
    }

}


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


sendOrderApprovationMail = async (customerEmail, order, from) => {


    header = '';
    text = '',
        subject = '';

    if (from === orderStatus.ShipmentSuccessed) {
        subject = order.referanceCode + ' referans kodlu Nishman Siparişiniz kargoya teslim edilmiştir.'
        header = order.referanceCode + ' referans kodlu Nishman Siparişiniz kargoya teslim edilmiştir.'
        text = 'Aşşağıdaki ürünleriniz <span style="font-weight:bold">' + order.cargoCompany + '</span>\'ya teslim edilmiştir. Kargo takip numaranız : <span style="font-weight:bold">' + order.trackingCode + '</span> </br></br> Satış sözleşmenizi <a href="https://berber.nishman.com.tr/agreement/' + order._id + '"> bu link </a>ten görebilirsiniz';
    }
    else {

        header = order.referanceCode + ' referans kodlu Nishman siparişiniz onaylanmıştır';
        text = order.referanceCode + ' referans kodlu Nishman Siparişiniz kargoya teslim edildiğinde takip numarasının olduğu bir mail göndereceğiz </br></br> Satış sözleşmenizi <a href="https://berber.nishman.com.tr/agreement/' + order._id + '"> bu link </a>ten görebilirsiniz',
            subject = order.referanceCode + 'referans kodlu Nishman siparişiniz onaylandı';

    }

    await Email.find({ owner: 'noreply' })
        .then(emailSetting => {


            if (emailSetting === []) {

                const error = new Error('Could not find emailSetting for this Owner');
                err.statusCode = 404;
                throw error;
            }




            const transporter = nodemailer.createTransport({
                host: emailSetting[0].smtp,
                port: emailSetting[0].port,
                secure: emailSetting[0].secure,
                auth: {
                    user: emailSetting[0].userName,
                    pass: emailSetting[0].password
                },

                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }
            });


            let htmlForMailHead = "<html>" +
                "<head>" +
                "<style>" +
                "table {" +
                "width:100%;" +
                "}" +
                "table, th, td {" +
                "border: 1px solid black;" +
                "border-collapse: collapse;" +
                "}" +
                "th, td {" +
                "padding: 15px;" +
                "text-align: left;" +
                "}" +
                "#t01 tr:nth-child(even) {" +
                "background-color: #eee;" +
                "}" +
                "#t01 tr:nth-child(odd) {" +
                "background-color: #fff;" +
                "}" +
                "#t01 th {" +
                "background-color: black;" +
                "color: white;" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +

                "<h2>" + header + "</h2>" +
                "<p>" + text + "</p>" +

                "<table id='t01'>" +
                "<tr>" +
                "<th>#</th>" +
                "<th>Ürün</th>" +
                "<th>Ölçü</th>" +
                "<th>Birim Fiyat</th>" +
                "<th>Adet</th>" +
                "<th>Toplam Fiyat</th>" +
                "</tr>";


            let htmlForMailBody = '';

            for (let product of order.products) {

                let productPic = baseUrl.imageApiUrl + product.product.image[0];

        

                let htmlForMailRow = "<tr>" +
                    "<td><img width='80' height='80' src=" + productPic + "></td>" +
                    "<td>" + product.product.title + "</td>" +
                    "<td>" + product.volume + " " + product.volumeEntity + "   </td>" +
                    "<td>" + product.unitPrice + " " + product.currency + "  </td>" +
                    "<td>" + product.unit + "  </td>" +
                    "<td>" + product.totalPrice + " " + product.currency + "  </td>" +
                    "</tr>";

                htmlForMailBody += htmlForMailRow;

            }

            let htmlForMailFoot = "<tfoot>" +
                "<tr>" +
                "<td></td>" +
                "<td></td>" +
                "<td> </td>" +
                "<td> </td>" +
                "<td style='font-weight:bold'> Toplam </td>" +
                "<td style='font-weight:bold'>" + order.grandTotal + " " + order.currency + "  </td>" +
                "</tr> </tfoot>";

            let htmlForMailFooter = "</table></body></html> ";

            let htmlForMail = htmlForMailHead + htmlForMailBody + htmlForMailFoot + htmlForMailFooter;




            const mailOptions = {
                from: emailSetting[0].userName,
                to: customerEmail,
                subject: subject,
                html: htmlForMail
            };
            let information;


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                    errorService.sendErrorNotificationViaEmail('orderController','sendOrderApprovationMail',2349,500,error);

                    console.log('email error : ' + information);
                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            });


        });


}


sendOrderNotificationMail = async (partnerEmail, order, from) => {


    header = '';
    text = '',
        subject = '';

    if (from === orderStatus.ShipmentSuccessed) {
        subject = order.referanceCode + ' referans kodlu Nishman Siparişiniz kargoya teslim edilmiştir.'
        header = order.referanceCode + ' referans kodlu Nishman Siparişiniz kargoya teslim edilmiştir.'
        text = order.referanceCode + ' referans kodlu Nishman siparişinizde ki ürünleriniz <span style="font-weight:bold">' + order.cargoCompany + '</span>\'ya teslim edilmiştir. Kargo takip numaranız : <span style="font-weight:bold">' + order.trackingCode + '</span> </br></br> Satış sözleşmenizi <a href="https://berber.nishman.com.tr/agreement/' + order._id + '"> bu link </a>ten görebilirsiniz';
    }
    else {

        header = order.referanceCode + ' referans kodlu Nishman siparişiniz onaylanmıştır';
        text = order.referanceCode + ' referans kodlu Nishman siparişiniz kargoya teslim edildiğinde takip numarasının olduğu bir mail göndereceğiz </br></br> Satış sözleşmenizi <a href="https://berber.nishman.com.tr/agreement/' + order._id + '"> bu link </a>ten görebilirsiniz',
            subject = order.referanceCode + ' referans kodlu Nishman siparişiniz onaylandı';

    }

    await Email.find({ owner: 'noreply' })
        .then(emailSetting => {


            if (emailSetting === []) {

                const error = new Error('Could not find emailSetting for this Owner');
                err.statusCode = 404;
                throw error;
            }

            const transporter = nodemailer.createTransport({
                host: emailSetting[0].smtp,
                port: emailSetting[0].port,
                secure: emailSetting[0].secure,
                auth: {
                    user: emailSetting[0].userName,
                    pass: emailSetting[0].password
                }
            });


            let htmlForMailHead = "<html>" +
                "<head>" +
                "<style>" +
                "table {" +
                "width:100%;" +
                "}" +
                "table, th, td {" +
                "border: 1px solid black;" +
                "border-collapse: collapse;" +
                "}" +
                "th, td {" +
                "padding: 15px;" +
                "text-align: left;" +
                "}" +
                "#t01 tr:nth-child(even) {" +
                "background-color: #eee;" +
                "}" +
                "#t01 tr:nth-child(odd) {" +
                "background-color: #fff;" +
                "}" +
                "#t01 th {" +
                "background-color: black;" +
                "color: white;" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +

                "<h2>" + header + "</h2>" +
                "<p>" + text + "</p>" +

                "<table id='t01'>" +
                "<tr>" +
                "<th>#</th>" +
                "<th>Ürün</th>" +
                "<th>Ölçü</th>" +
                "<th>Birim Fiyat</th>" +
                "<th>Adet</th>" +
                "<th>Toplam Fiyat</th>" +
                "</tr>";


            let htmlForMailBody = '';

            for (let product of order.products) {

                let productPic = baseUrl.imageApiUrl + product.product.image[0];

           

                let htmlForMailRow = "<tr>" +
                    "<td><img width='80' height='80' src=" + productPic + "></td>" +
                    "<td>" + product.product.title + "</td>" +
                    "<td>" + product.volume + " " + product.volumeEntity + "   </td>" +
                    "<td>" + product.unitPrice + " " + product.currency + "  </td>" +
                    "<td>" + product.unit + "  </td>" +
                    "<td>" + product.totalPrice + " " + product.currency + "  </td>" +
                    "</tr>";

                htmlForMailBody += htmlForMailRow;

            }

            let htmlForMailFoot = "<tfoot>" +
                "<tr>" +
                "<td></td>" +
                "<td></td>" +
                "<td> </td>" +
                "<td> </td>" +
                "<td style='font-weight:bold'> Toplam </td>" +
                "<td style='font-weight:bold'>" + order.grandTotal + " " + order.currency + "  </td>" +
                "</tr> </tfoot>";

            let htmlForMailFooter = "</table></body></html> ";

            let htmlForMail = htmlForMailHead + htmlForMailBody + htmlForMailFoot + htmlForMailFooter;




            const mailOptions = {
                from: emailSetting[0].userName,
                to: partnerEmail,
                subject: subject,
                html: htmlForMail
            };
            let information;

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                    errorService.sendErrorNotificationViaEmail('orderController','sendOrderNotificationMail',2505,500,error);

                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            });


        });


}

sendDetailReportMail = async (type, year, month, emails, productNumber, products, grandTotal, currency) => {


    header = '';
    text = '',
        subject = '';

    if (type === 'Yillik') {

        subject = 'Nishman ' + year + ' yılı detay raporu'
        header = 'Nishman ' + year + ' yılı detay raporu'
        text = productNumber + " farklı kalem ürünün toplam satış miktarları ve bu satışlardan elde edilen gelir <span style='font-weight:bold;'>" + year + "</span> yılı için detaylandırılmıştır.";

    } else {

        subject = 'Nishman ' + month + ' ayı detay raporu'
        header = 'Nishman ' + month + ' ayı detay raporu'
        text = productNumber + " farklı kalem ürünün toplam satış miktarları ve bu satışlardan elde edilen gelir <span style='font-weight:bold;'>" + month + "</span> ayı için detaylandırılmıştır.";

    }





    await Email.find({ owner: 'noreply' })
        .then(emailSetting => {


            if (emailSetting === []) {

                const error = new Error('Could not find emailSetting for this Owner');
                err.statusCode = 404;
                throw error;
            }

            const transporter = nodemailer.createTransport({
                host: emailSetting[0].smtp,
                port: emailSetting[0].port,
                secure: emailSetting[0].secure,
                auth: {
                    user: emailSetting[0].userName,
                    pass: emailSetting[0].password
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }
            });


            let htmlForMailHead = "<html>" +
                "<head>" +
                "<style>" +
                "table {" +
                "width:100%;" +
                "}" +
                "table, th, td {" +
                "border: 1px solid black;" +
                "border-collapse: collapse;" +
                "}" +
                "th, td {" +
                "padding: 15px;" +
                "text-align: left;" +
                "}" +
                "#t01 tr:nth-child(even) {" +
                "background-color: #eee;" +
                "}" +
                "#t01 tr:nth-child(odd) {" +
                "background-color: #fff;" +
                "}" +
                "#t01 th {" +
                "background-color: black;" +
                "color: white;" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +

                "<h2>" + header + "</h2>" +
                "<p>" + text + "</p>" +

                "<table id='t01'>" +
                "<tr>" +
                "<th>#</th>" +
                "<th>Ürün</th>" +
                "<th>Ölçü</th>" +
                "<th>Stok</th>" +
                "<th>Adet</th>" +
                "<th>Toplam Fiyat</th>" +
                "</tr>";


            let htmlForMailBody = '';

            for (let product of products) {

                let productPic = baseUrl.imageApiUrl + product.imageUrl;



                let htmlForMailRow = "<tr>" +
                    "<td><img width='80' height='80' src=" + productPic + "></td>" +
                    "<td>" + product.title + "</td>" +
                    "<td>" + product.volume + " " + product.volumeEntity + "   </td>" +
                    "<td>" + product.stock + " </td>" +
                    "<td>" + product.unit + "  </td>" +
                    "<td>" + product.grandTotal + " " + product.currency + "  </td>" +
                    "</tr>";

                htmlForMailBody += htmlForMailRow;

            }

            let htmlForMailFoot = "<tfoot>" +
                "<tr>" +
                "<td></td>" +
                "<td></td>" +
                "<td> </td>" +
                "<td> </td>" +
                "<td style='font-weight:bold'> Toplam </td>" +
                "<td style='font-weight:bold'>" + grandTotal + " " + currency + "  </td>" +
                "</tr> </tfoot>";

            let htmlForMailFooter = "</table></body></html> ";

            let htmlForMail = htmlForMailHead + htmlForMailBody + htmlForMailFoot + htmlForMailFooter;




            const mailOptions = {
                from: emailSetting[0].userName,
                to: emails,
                subject: subject,
                html: htmlForMail
            };
            let information;




            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                    errorService.sendErrorNotificationViaEmail('orderController','sendDetailReportMail',2650,500,error);
                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            });


        });


}

