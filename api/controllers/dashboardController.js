const mongodb = require('mongodb');
const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const OrderSearch = require('../models/orderSearch');
const Order = require('../models/order');
const ProductStockCheck = require('../models/productStockCheck');
const ObjectId = mongodb.ObjectId;
const errorService = require('../classes/errorService');

// exports.getProducts = async (req, res, next) => {

//     try {
//         const totalProduct = await Product.find().countDocuments();
//         const products = await Product.find().sort({ stock: 1 });






//         res.status(200).json({
//             message: 'Fetched products succesfully',
//             products: products,
//             totalProduct: totalProduct
//         })

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }

// }


exports.getProducts = async (req, res, next) => {

    try {


        await OrderSearch.deleteMany({});

        const __products = await Product.find();

        __products.forEach(p => {
            orderSearchProduct = new OrderSearch({
                productId: p._id,
                title: p.title,
                imageUrl: p.image[0],
                volume: p.volume,
                volumeEntity: p.volumeEntity,
                stock: p.stock,
                virtualStock: p.virtualStock,
                quantityInBox: p.quantityInBox,
                order: p.order,

            });

            orderSearchProduct.save();

        })




        const orders = await Order.find({ status: { $eq: "Pending Approval" } })

        let orderForProducts;


        if (!orders) {    

            orderForProducts = await Product.find().sort({ virtualStock: 1 });
        }
        else {

            for (let product of __products) {

                unitInOrder = 0;
                boxInOrder = 0;
                _totalUnit = 0;
                _totalBox = 0;
                _totalGranTotal = 0;
                _currency = '';
                totalPrice = 0;
                afterCalculatedStock = 0;


                for (let order of orders) {
                    let found = false;

                    for (let o of order.products) {

                        if (o.product._id == product._id) {
                            _totalUnit += o.unit;
                            _totalBox += o.box;
                            _totalGranTotal += o.totalPrice;
                            totalPrice = o.totalPrice;
                            unitInOrder = o.unit;
                            boxInOrder = o.box;
                            afterCalculatedStock = product.virtualStock - o.unit;


                            _currency = order.currency;
                            quantityInBox = o.quantityInBox;
                            found = true;
                        }
                    }


                    if (found == true) {

                        const _prod = await OrderSearch.find({ 'productId': product._id });

                        let newOrder = {
                            orderId: order._id,
                            status: order.status,
                            customer: order.customer,
                            country: order.country,
                            totalPrice: totalPrice,
                            currency: order.currency,
                            unit: unitInOrder,
                            box: boxInOrder,
                            createdAt: order.createdAt
                        }
                        _prod[0].orders.push(newOrder);
                        _prod[0].save();
                    }


                }

                const prod = await OrderSearch.find({ 'productId': product._id });



                prod[0].unit = _totalUnit;
                prod[0].box = _totalBox;
                prod[0].grandTotal = _totalGranTotal;
                prod[0].currency = _currency;
                prod[0].afterCalculatedStock = afterCalculatedStock;
                prod[0].save();

            }




            orderForProducts = await OrderSearch.find().sort({ virtualStock: 1 });

        }







        res.status(200).json({
            message: 'Fetched products succesfully',
            products: orderForProducts,
            totalProduct: 135
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('dashboardController', 'getProducts',39, 500, err);
        next(err);
    }

}


exports.getCheckProductStock = async (req, res, next) => {


    try {

        await OrderSearch.deleteMany({});

        const __products = await Product.find();


        __products.forEach(p => {
            orderSearchProduct = new OrderSearch({
                productId: p._id,
                title: p.title + ' - ' + p.volume + p.volumeEntity,
                imageUrl: p.image[0],
                stock: p.stock,
                virtualStock: p.virtualStock,
                quantityInBox: p.quantityInBox,
                order: p.order,

            });

            orderSearchProduct.save();

        })


        const orders = await Order.find({ $or: [{ status: { $eq: "Getting Ready" } }, { status: { $eq: "Order Approved" } }] })


        for (let product of __products) {

            unitInOrder = 0;
            boxInOrder = 0;
            _totalUnit = 0;
            _totalBox = 0;
            _totalGranTotal = 0;
            _currency = '';
            totalPrice = 0;
            afterCalculatedStock = 0;



            for (let order of orders) {
                let found = false;

                for (let o of order.products) {
                    if (o.product._id == product._id) {
                        _totalUnit += o.unit;
                        _totalBox += o.box;
                        _totalGranTotal += o.totalPrice;
                        totalPrice = o.totalPrice;
                        unitInOrder = o.unit;
                        boxInOrder = o.box;
                        afterCalculatedStock = product.virtualStock - o.unit;

                        _currency = order.currency;
                        quantityInBox = o.quantityInBox;
                        found = true;
                    }
                }


                if (found == true) {

                    const _prod = await OrderSearch.find({ 'productId': product._id });

                    let newOrder = {
                        orderId: order._id,
                        status: order.status,
                        customer: order.customer,
                        country: order.country,
                        totalPrice: totalPrice,
                        currency: order.currency,
                        unit: unitInOrder,
                        box: boxInOrder,
                        createdAt: order.createdAt
                    }



                    _prod[0].orders.push(newOrder);
                    _prod[0].save();

                }


            }

            const prod = await OrderSearch.find({ 'productId': product._id });



            prod[0].unit = _totalUnit;
            prod[0].box = _totalBox;
            prod[0].grandTotal = _totalGranTotal;
            prod[0].currency = _currency;
            prod[0].afterCalculatedStock = afterCalculatedStock;
            prod[0].save();


        }

        const orderForProducts = await OrderSearch.find().sort({ order: 1 });


        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            orders: orderForProducts
            // totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('dashboardController', 'getCheckProductStock',179, 500, err);

        next(err);
    }





}