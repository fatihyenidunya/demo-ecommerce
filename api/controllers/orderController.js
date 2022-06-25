const mongodb = require('mongodb');
const OrderTransaction = require('../models/orderTransaction');
const ShipmentDetail = require('../models/shipmentDetail');
const ShippedProduct = require('../models/shippedProduct');
const OrderProductTransaction = require('../models/orderProductTransaction');
const OrderProductRetailerTransaction = require('../models/orderProductRetailerTransaction');
const Order = require('../models/order');
const OrderRetailer = require('../models/orderRetail');
const Customer = require('../models/customer');
const OrderNotify = require('../models/orderNotify');
const OrderOperationNotify = require('../models/orderOperationNotify');
const OrderOperationNotifySeeWho = require('../models/orderOperationNotifySeeWho');
const WareHouseNotify = require('../models/wareHouseNotify');
const Transporter = require('../models/transporter');
const OrderSearch = require('../models/orderSearch');
const Custom = require('../models/custom');
const Product = require('../models/product');
const PromotionProduct = require('../models/promotionProduct');
const DealerPdf = require('../models/dealerPdf');
const OrderProduct = require('../models/orderProduct');
const ProductShipmentLog = require('../models/productShipmentLog');
const { validationResult } = require('express-validator/check');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Excel = require('exceljs');
const mongoose = require('mongoose');
const fileHelper = require('../utils/file');
const { ADDRGETNETWORKPARAMS } = require('dns');
const orderproduct = require('../models/orderProduct');
const shipmentDetail = require('../models/shipmentDetail');
const order = require('../models/order');
const { query } = require('express');
const io = require('../socket');
const { networkInterfaces } = require('os');
const dealerPdf = require('../models/dealerPdf');
const { read } = require('pdfkit');
const emailController = require('./emailController');
const Basket = require('../models/basket');
const Email = require('../models/email');
const User = require('../models/user');
const orderStatus = require('../classes/orderStatus');
const errorService = require('../classes/errorService');


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
            message: 'Fetched customer basket products succesfully',
            orders: orders,
            totalOrders: totalItems

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getMyOrders', 70, 500, err);

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
        errorService.sendErrorNotificationViaEmail('orderController', 'getMyOrdersForMobil', 105, 500, err);

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
        errorService.sendErrorNotificationViaEmail('orderController', 'getMyOrderProductsForMobil', 140, 500, err);

        next(err);
    }

}

exports.getMakePdf = async (req, res, next) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;

    const order = await Order
        .findById(orderId);

    const invoiceName = 'order-' + orderId + '.pdf';
    const invoicePath = path.join('images', 'orderPDF', invoiceName);



    try {




        const pdfDoc = new PDFDocument({ autoFirstPage: false });



        const logo = path.join('data', 'nishmanlogotwo.jpg');



        pdfDoc.addPage({ margin: 10 });
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        let _now = new Date();

        pdfDoc.image(logo, 10, 3, { fit: [51, 36] }).stroke();

        pdfDoc.fontSize(12).font('Helvetica-Bold').text('ASiL GROUP iC ve DIS TiC. SAN. LTD. STi.', 65, 10);
        pdfDoc.fontSize(8).text('www.nishman.com.tr', 330, 12);
        pdfDoc.fontSize(8).text('P: +90 212 552 00 39', 420, 12);

        pdfDoc.fontSize(8).text('E: info@asilgroup.com.tr', 10, 12, { align: 'right' });


        let y = 40;

        pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //bottom

        pdfDoc.fontSize(10).font('Helvetica-Bold').text("ASiL GROUP iC ve DIS TiC. SAN. LTD. STi.", 10, y + 10);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Address : ", 10, y + 25);
        pdfDoc.fontSize(9).font('Helvetica').text("Kavakli Mah. Istanbul Cad. No:19/1", 75, y + 25);


        pdfDoc.fontSize(10).font('Helvetica-Bold').text("DELIVERY INFORMATIONS", 280, y + 10);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Country :", 280, y + 25);
        pdfDoc.fontSize(9).font('Helvetica').text(order.deliveryAddress.country, 325, y + 25);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Address :", 280, y + 38);
        pdfDoc.fontSize(9).font('Helvetica').text(order.deliveryAddress.address, 325, y + 38);

        pdfDoc.fontSize(8).font('Helvetica-Bold').text("PRICES ARE BASED ON " + order.paymentBased, 280, y + 94);



        pdfDoc.fontSize(9).font('Helvetica').text("Beylikdüzü 34520 / ISTANBUL / TURKIYE", 75, y + 38);


        pdfDoc.fontSize(8).font('Helvetica-Bold').text("PAYMENT TERM : " + order.paymentTerm + " BALANCE BEFORE SHIPMENT", 280, y + 107);
        // pdfDoc.fontSize(10).font('Helvetica-Bold').text("BEFORE SHIPMENT ", 306, y + 48);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Tax Id : ", 10, y + 53);
        pdfDoc.fontSize(9).font('Helvetica').text("BEYLIKDUZU VD / 0860550943", 75, y + 53);

        pdfDoc.fontSize(8).font('Helvetica-Bold').text("DELIVERY TIME : " + order.deliveryTime, 280, y + 120);



        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Bank Name : ", 10, y + 68);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.bank, 75, y + 68);




        pdfDoc.fontSize(9).font('Helvetica-Bold').text(order.paymentBankAccount.currency + " Iban No : ", 10, y + 83);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.ibanNo, 75, y + 83);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Account No : ", 10, y + 98);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.accountNo, 75, y + 98);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Branch : ", 10, y + 113);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.branch, 75, y + 113);


        pdfDoc.fontSize(9).font('Helvetica-Bold').text("SWIFT CODE : ", 10, y + 128);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.swiftCode, 75, y + 128);


        y = y + 113;

        pdfDoc.save().moveTo(10, y + 30).lineTo(600, y + 30).stroke(); //top
        pdfDoc.save().moveTo(10, y + 30).lineTo(10, y + 60).stroke(); //left
        pdfDoc.save().moveTo(10, y + 60).lineTo(600, y + 60).stroke(); //bottom
        pdfDoc.save().moveTo(600, y + 30).lineTo(600, y + 60).stroke(); //

        pdfDoc.save().moveTo(415, y + 30).lineTo(415, y + 60).stroke(); //
        pdfDoc.fontSize(13).font('Helvetica-Bold').text(order.customer, 15, y + 42);
        pdfDoc.fontSize(13).text('Date : ' + (_now.getMonth() + 1) + " / " + _now.getDate() + " / " + _now.getFullYear(), 440, y + 40);
        pdfDoc.save().moveTo(10, y + 85).lineTo(600, y + 85).stroke(); //bottom
        pdfDoc.save().moveTo(10, y + 60).lineTo(10, y + 85).stroke(); //left
        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Description of Goods', 15, y + 70);
        // pdfDoc.save().moveTo(360, 60).lineTo(30, 85).stroke(); //
        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Volume', 374, y + 70);
        pdfDoc.save().moveTo(370, y + 60).lineTo(370, y + 85).stroke(); //right

        // pdfDoc.fontSize(9).font('Helvetica-Bold').text('Boxes', 253, 70);
        // pdfDoc.save().moveTo(285, 60).lineTo(285, 85).stroke(); //right

        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Unit', 424, y + 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Price', 423, y + 75);
        pdfDoc.save().moveTo(415, y + 60).lineTo(415, y + 85).stroke(); //right


        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Total', 456, y + 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Unit', 457, y + 75);
        pdfDoc.save().moveTo(450, y + 60).lineTo(450, y + 85).stroke(); //right

        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Boxes', 488, y + 70);
        pdfDoc.save().moveTo(485, y + 60).lineTo(485, y + 85).stroke(); //right

        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Total', 432, 65);
        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Volume', 430, 75);
        // pdfDoc.save().moveTo(465, 60).lineTo(465, 85).stroke(); //right

        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Total', 478, 65);
        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Weight', 476, 75);
        pdfDoc.save().moveTo(520, y + 60).lineTo(520, y + 85).stroke(); //right

        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Total Price', 527, y + 70);

        pdfDoc.save().moveTo(600, y + 60).lineTo(600, y + 85).stroke(); //

        const products = order.products;

        let grandTotal = 0;
        x = 245;
        y = 238;
        line = 0;
        page = 1;
        limitOfLine = 25;
        products.forEach(prod => {


            if (page != 1) {
                limitOfLine = 36;

            }

            if (line == limitOfLine) {
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);
                pdfDoc.addPage({ margin: 10 });
                page++;
                x = 37;
                y = 30;
                line = 0;
                pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //top

                let _totalPrice = 0;

                _totalPrice = Number(prod.box) * Number(prod.product.quantityInBox) * Number(prod.unitPrice);


                grandTotal += _totalPrice;

                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left


                pdfDoc.fontSize(8).font('Helvetica').text(prod.product.title, 15, x);





                if (prod.product.volumeEntity != 'Not') {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume + " " + prod.product.volumeEntity, 375, x);
                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length > 7) {
                    pdfDoc.fontSize(6).font('Helvetica').text(prod.product.volume, 375, x);

                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length <= 8) {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume, 375, x);
                }

                pdfDoc.save().moveTo(370, y).lineTo(370, y + 20).stroke(); //right

                pdfDoc.fontSize(7).font('Helvetica').text(prod.unitPrice + " " + prod.currency, 418, x);
                pdfDoc.save().moveTo(415, y).lineTo(415, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.unit, 455, x);
                pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.box, 489, x);
                pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right


                pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right




                pdfDoc.fontSize(9).font('Helvetica').text(_totalPrice.toFixed(2) + " " + prod.currency, 527, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom

                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);



                x += 20
                y += 20
                line++;


            } else {
                let _totalPrice = 0;

                _totalPrice = Number(prod.box) * Number(prod.product.quantityInBox) * Number(prod.unitPrice);


                grandTotal += _totalPrice;


                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left


                pdfDoc.fontSize(8).font('Helvetica').text(prod.product.title, 15, x);




                if (prod.product.volumeEntity != 'Not') {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume + ' ' + prod.product.volumeEntity, 375, x);
                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length > 7) {
                    pdfDoc.fontSize(6).font('Helvetica').text(prod.product.volume, 375, x);

                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length <= 8) {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume, 375, x);
                }

                pdfDoc.save().moveTo(370, y).lineTo(370, y + 20).stroke(); //right

                pdfDoc.fontSize(7).font('Helvetica').text(prod.unitPrice + " " + prod.currency, 418, x);
                pdfDoc.save().moveTo(415, y).lineTo(415, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.unit, 455, x);
                pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.box, 489, x);
                pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right


                pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right




                pdfDoc.fontSize(9).font('Helvetica').text(_totalPrice.toFixed(2) + " " + prod.currency, 527, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                // pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);
                x += 20
                y += 20
                line++;

            }


        });

        if (line != limitOfLine) {


            pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left
            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Pallet : ", 15, x);
            pdfDoc.fontSize(9).font('Helvetica').text(order.pallet, 47, x);

            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Volume : ", 70, x);
            pdfDoc.fontSize(9).font('Helvetica').text(order.totalVolume + ' m3', 133, x);

            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Weight : ", 200, x);
            pdfDoc.fontSize(9).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 260, x);

            pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom


            pdfDoc.save().moveTo(370, y).lineTo(370, y + 20).stroke(); //right
            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Grand Total ", 390, x);
            // pdfDoc.save().moveTo(350, y).lineTo(350, y + 20).stroke(); //right

            pdfDoc.fontSize(8).font('Helvetica').text(order.totalProduct, 455, x);
            pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

            pdfDoc.fontSize(8).font('Helvetica').text(order.totalBoxes, 489, x);
            pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right

            pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right

            pdfDoc.fontSize(9).font('Helvetica-Bold').text(grandTotal.toFixed(2) + " " + order.currency, 527, x);
            pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
            pdfDoc.save().moveTo(260, y + 20).lineTo(600, y + 20).stroke(); //bottom

            pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);

        }


        if (limitOfLine === 36 || limitOfLine === 25) {

            if (line == (limitOfLine)) {

                y = (28 * 20) + 82;
                pdfDoc.addPage({ margin: 10 });
                page++;

                y = 15;
                x = 22;
                pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left
                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Pallet : ", 15, x);
                pdfDoc.fontSize(9).font('Helvetica').text(order.pallet, 47, x);

                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Volume : ", 70, x);
                pdfDoc.fontSize(9).font('Helvetica').text(order.totalVolume + ' m3', 133, x);

                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Weight : ", 200, x);
                pdfDoc.fontSize(9).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 260, x);

                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom


                pdfDoc.save().moveTo(380, y).lineTo(380, y + 20).stroke(); //right
                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Grand Total ", 390, x);
                // pdfDoc.save().moveTo(350, y).lineTo(350, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(order.totalProduct, 455, x);
                pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(order.totalBoxes, 489, x);
                pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right

                // pdfDoc.fontSize(8).font('Helvetica').text(order.totalVolume + ' m3', 425, x);
                // pdfDoc.save().moveTo(465, y).lineTo(465, y + 20).stroke(); //right

                // pdfDoc.fontSize(8).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 469, x);
                pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right

                pdfDoc.fontSize(9).font('Helvetica-Bold').text(grandTotal.toFixed(2) + " " + order.currency, 525, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                pdfDoc.save().moveTo(260, y + 20).lineTo(600, y + 20).stroke(); //bottom
                // pdfDoc.fontSize(8).text('www.nishman.com.tr', 510, 772);
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);




            }



        }

        pdfDoc.end();

        const pdf = new DealerPdf({
            customerId: customerId,
            orderId: orderId
        });

        const pdfFile = await DealerPdf.find({ customerId: customerId.toString(), orderId: orderId.toString() });

        if (pdfFile.length == 0) {
            const result = await pdf.save();
        }






    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getMakePDF', 170, 500, err);

        next(err);
    }

}


exports.getPdf = async (req, res, next) => {
    const customerId = req.params.customerId
    const orderId = req.params.orderId



    try {



        const invoiceName = 'order-' + orderId + '.pdf';
        const invoicePath = path.join('images', 'orderPDF', invoiceName);


        // const pdf = new DealerPdf({
        //     customerId: customerId,
        //     orderId: orderId

        // });

        // const result = await pdf.save();



        res.status(200).json({
            message: 'Pdf',
            pdf: invoicePath,


        })



    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getPDF', 575, 500, err);

        next(err);
    }

}


convertToEmptyFromUndefined = (value) => {
    if (value === undefined || value === 'undefined') {
        value = '';
    }
    return value;

}


exports.postGiveAnOrder = async (req, res, next) => {

    const customerId = req.body.customerId;
    const customer = req.body.customer;
    const totalProduct = req.body.totalProduct;
    const grandTotal = req.body.grandTotal;
    const currency = req.body.currency;
    const customerNote = convertToEmptyFromUndefined(req.body.customerNote);
    const count = req.body.count;
    const basketModel = req.body.basketModel;
    const country = req.body.country;
    const emptyBoxWeight = req.body.emptyBoxWeight;

    const totalVolume = req.body.totalVolume;
    const totalWeight = req.body.totalWeight;
    const totalWeightEntity = req.body.totalWeightEntity;
    const totalBoxes = req.body.totalBoxes;
    const pallet = req.body.pallet;

    const billingAddress = req.body.billingAddress;
    const deliveryAddress = req.body.deliveryAddress;

    console.log("totalWeight" + totalWeight)
    console.log("totalVolume" + totalVolume)



    const _customer = await Customer.findById(customerId);



    const owner = _customer.owner;
    const owerRole = _customer.ownerRole;





    const status = orderStatus.PendingApproval;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {

        const products = JSON.parse(basketModel);
        const _billingAddress = JSON.parse(billingAddress);
        const _deliveryAddress = JSON.parse(deliveryAddress);



        const order = new Order({
            totalProduct: totalProduct,
            grandTotal: grandTotal,
            currency: currency,
            customerNote: customerNote,
            customerId: customerId,
            customer: customer,
            country: country,
            products: products,
            totalVolume: totalVolume,
            totalWeight: totalWeight,
            totalWeightEntity: totalWeightEntity,
            totalBoxes: totalBoxes,
            pallet: pallet,
            billingAddress: _billingAddress,
            deliveryAddress: _deliveryAddress,
            owner: owner
        });


        const result = await order.save();


        for (let p of products) {

            await Basket.findOneAndDelete({ customer: customerId, product: p.product._id });

        }




        const orderTransaction = new OrderTransaction({
            orderId: result._id
        });

        const result3 = await orderTransaction.save();

        const newOrderNotify = new OrderNotify({
            orderId: result._id,
            customerId: customerId,
            customer: customer,
            country: country,
            status: status,
            grandTotal: grandTotal,
            number: 1,
            currency: currency,
            notifyFor: 'dealer',
            userName: owner,
            notifyOwner: owner

        });

        await newOrderNotify.save();


        io.addNamespace('/orders').emit('newOrder', { orderNotify: newOrderNotify });



        res.status(201).json({ statusCode: 201, message: 'order created!', orderId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'postGiveAnOrder', 629, 500, err);

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
    const userRole = req.query.userrole;
    const userName = req.query.username;




    let totalItems = 40;


    let perPage = Number(pageSize);


    let queryTxt = "";
    let customerTxt = "";
    let statusTxt = "";
    let ownerTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (customer != '') {
        if (customer != 'undefined') {
            customerTxt = '"customer":{ "\$regex" : "' + customer + '", "\$options" : "i"},';
        }
    }

    if (status != 'All') {
        if (status != 'undefined') {
            statusTxt = '"status":"' + status + '",';

        }
    }

    if (userRole != 'Manager') {
        ownerTxt = '"owner":"' + userName + '",';
    }


    queryTxt = '{' + customerTxt + statusTxt + ownerTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


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
        errorService.sendErrorNotificationViaEmail('orderController', 'getOrders', 757, 500, err);

        next(err);
    }

}

exports.getOrdersForWarehouse = async (req, res, next) => {




    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    const status = req.query.status || orderStatus.OrderApproved;
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';

    const userRole = req.query.userrole;
    const userName = req.query.username;


    let totalItems = 40;


    let perPage = Number(pageSize);


    let queryTxt = "";
    let customerTxt = "";
    let statusTxt = "";
    let ownerTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (customer != '') {
        if (customer != 'undefined') {
            customerTxt = '"customer":{ "\$regex" : "' + customer + '", "\$options" : "i"},';
        }
    }

    if (status != 'All') {
        if (status != 'undefined') {
            statusTxt = '"status":"' + status + '",';

        }
    } else {
        statusTxt = '"status":{ "\$ne" : "Pending Approval"},';

    }



    if (userRole != 'Manager') {
        if (userRole != 'Warehouse') {
            ownerTxt = '"owner":"' + userName + '",';

        }

    }


    queryTxt = '{' + customerTxt + statusTxt + ownerTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);


    console.log(query)



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
        errorService.sendErrorNotificationViaEmail('orderController', 'getOrdersForWarehouse', 847, 500, err);

        next(err);
    }

}



exports.getOrderGroupForProducts = async (req, res, next) => {


    const userName = req.params.username;
    const userRole = req.params.userrole;

    try {


        await OrderSearch.deleteMany({});

        const __products = await Product.find();



        __products.forEach(p => {
            orderSearchProduct = new OrderSearch({
                productId: p._id,
                title: p.title + ' - ' + p.volume + p.volumeEntity,
                imageUrl: p.image[0],
                stock: p.stock,
                quantityInBox: p.quantityInBox,
                order: p.order,

            });

            orderSearchProduct.save();

        })

        ownerTxt = "";

        if (userRole != 'Admin') {

            ownerTxt = '"owner":"' + userName + '",';
        }




        queryTxt = '{ ' + ownerTxt + '"\$or": [{ "status": { "\$eq": "Getting Ready" } }, { "status": { "\$eq": "Order Approved" } }]}';


        const query = JSON.parse(queryTxt);
        const orders = await Order.find(query)



        for (let product of __products) {

            unitInOrder = 0;
            boxInOrder = 0;
            _totalUnit = 0;
            _totalBox = 0;
            _totalGranTotal = 0;
            _currency = '';
            totalPrice = 0;



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
        errorService.sendErrorNotificationViaEmail('orderController', 'getOrderGroupForProducts', 947, 500, err);

        next(err);
    }

}

exports.approveThis = async (req, res, next) => {


    const orderId = ObjectId(req.body.orderId);
    const userName = req.body.userName;
    const status = req.body.status;
    const operationalNote = req.body.operationalNote;
    const paymentBankAccount = req.body.paymentBankAccount;

    const terms = req.body.terms;
    const pallet = req.body.pallet;




    try {

        const order = await Order.findById(orderId);


        const orderOwner = order.owner;
        order.isApproved = true;

        order.status = status;
        order.operationalNote = operationalNote;


        const result = await order.save();



        const orderTransaction = new OrderTransaction({
            orderId: orderId,
            isApproved: true,
            status: status,
            userName: orderOwner
        });


        await orderTransaction.save();

        const orderTransactions = await OrderTransaction.find({ orderId: orderId }).sort({ createdAt: -1 });



        if (status == orderStatus.PendingApproval) {

            const newOrderNotify = new OrderNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'dealer'

            });

            await newOrderNotify.save();
        }


        if (status == orderStatus.OrderApproved) {




            const order = await Order.findById(orderId);
            order.number = 2;
            // order.owner = userName;
            order.originGrandTotal = order.grandTotal;
            order.originTotalProduct = order.totalProduct;

            order.paymentBankAccount = paymentBankAccount;



            order.deliveryTime = terms.deliveryTime;
            order.paymentTerm = terms.paymentTerm;
            order.paymentBased = terms.paymentBased;
            order.pallet = pallet;


            await order.save();


            for (let p of order.products) {


                const product = await Product.findById({ _id: p.product._id });
                product.virtualStock -= p.unit;
                await product.save();

            };



            // const newOrderOperationNotify = new OrderOperationNotify({
            //     orderId: orderId,
            //     customerId: order.customerId,
            //     customer: order.customer,
            //     country: order.country,
            //     status: status,
            //     number: 2,
            //     orderOwner: userName,
            //     grandTotal: order.grandTotal,
            //     currency: order.currency,
            //     notifyFor: 'dealer'

            // });

            // await newOrderOperationNotify.save();

            // sendPdf(customerEmail, orderId);


            const notify = await OrderNotify.find({ 'orderId': orderId, notifyOwner: orderOwner }).limit(1).sort({ createdAt: -1 });

            if (notify[0]) {

                const checkedDate = Date.now;
                await OrderNotify.updateOne({ _id: notify[0]._id }, { status: orderStatus.OrderApproved, userName: orderOwner, isChecked: true });
            }
            io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });


            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 2,
                notifyFor: 'dealer'

            });

            await wareHouseNotify.save();

            const unSeenCount = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies = await WareHouseNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        }


        if (status == orderStatus.GettingReady) {

            // const newOrderOperationNotify = new OrderOperationNotify({
            //     orderId: orderId,
            //     customerId: result.customerId,
            //     customer: result.customer,
            //     country: result.country,
            //     status: status,
            //     number: 3,
            //     orderOwner: orderOwner,
            //     grandTotal: result.grandTotal,
            //     currency: result.currency,
            //     notifyFor: 'dealer'

            // });

            // await newOrderOperationNotify.save();

            // const order = await Order.findById(orderId);
            // order.number = 3;
            // await order.save();

            // const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            // const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            // io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });


            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 3,
                notifyFor: 'dealer'

            });

            await wareHouseNotify.save();

            const unSeenCount1 = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies1 = await WareHouseNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse').emit('operation', { status: status, notifies: notifies1, unSeenCount: unSeenCount1 });




        }

        if (status == orderStatus.WaitingforShipmentApproval) {

            const newOrderOperationNotify = new OrderOperationNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 4,
                orderOwner: orderOwner,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'dealer'

            });

            let notify = await newOrderOperationNotify.save();

            const order = await Order.findById(orderId);
            order.number = 4;
            await order.save();


            // let orderOperationNotifies = await OrderOperationNotify.find({ orderId: order._id, isChecked: false, number: { $lt: notify.number } });

            // for (let n of orderOperationNotifies) {
            //     n.isChecked = true;
            //     await n.save();

            // }


            const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });



        }


        if (status == orderStatus.ShipmentApproved) {



            let _order = await Order.findById(orderId);
            _order.shippedProductNumber = 0;
            _order.shippedProductTotalPrice = 0;
            for (let p of _order.products) {

                _order.shippedProductNumber += p.readyUnit;
                _order.shippedProductTotalPrice += p.readyUnit * p.unitPrice;
            }

            _order.shippedProductNumber += _order.promotionProductNumber;
            _order.shippedProductTotalPrice += _order.promotionProductTotalPrice;

            _order.shippedProductTotalPrice = _order.shippedProductTotalPrice.toFixed(2);

            _order.number = 7;

            await _order.save();


            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 7,
                notifyFor: 'dealer'

            });

            await wareHouseNotify.save();

            const unSeenCount1 = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies1 = await WareHouseNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse').emit('operation', { status: status, notifies: notifies1, unSeenCount: unSeenCount1 });

        }

        if (status == orderStatus.ShipmentSuccessed) {

            // const newOrderOperationNotify = new OrderOperationNotify({
            //     orderId: orderId,
            //     customerId: result.customerId,
            //     customer: result.customer,
            //     country: result.country,
            //     status: status,
            //     number: 6,
            //     orderOwner: orderOwner,
            //     grandTotal: result.grandTotal,
            //     currency: result.currency,
            //     notifyFor: 'dealer'

            // });

            // await newOrderOperationNotify.save();

            // const order = await Order.findById(orderId);
            // order.number = 6;
            // await order.save();

            // const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            // const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            // io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        }



        if (status == orderStatus.ReservationWanted) {



            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 8,
                notifyFor: 'dealer'

            });

            await wareHouseNotify.save();

            const unSeenCount1 = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies1 = await WareHouseNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse').emit('operation', { status: status, notifies: notifies1, unSeenCount: unSeenCount1 });


        }


        if (status == orderStatus.ReservationOkay) {

            // const newOrderOperationNotify = new OrderOperationNotify({
            //     orderId: orderId,
            //     customerId: result.customerId,
            //     customer: result.customer,
            //     country: result.country,
            //     status: status,
            //     number: 9,
            //     orderOwner: orderOwner,
            //     grandTotal: result.grandTotal,
            //     currency: result.currency,
            //     notifyFor: 'dealer'

            // });


            // await newOrderOperationNotify.save();

            // const order = await Order.findById(orderId);
            // order.number = 9;
            // await order.save();

            // const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            // const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            // io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        }





        if (status == orderStatus.CanceledWanted) {



            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 11,
                notifyFor: 'dealer'

            });

            await wareHouseNotify.save();

            const unSeenCount1 = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies1 = await WareHouseNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse').emit('operation', { status: status, notifies: notifies1, unSeenCount: unSeenCount1 });


        }


        if (status == orderStatus.CanceledOkay) {

            // const newOrderOperationNotify = new OrderOperationNotify({
            //     orderId: orderId,
            //     customerId: result.customerId,
            //     customer: result.customer,
            //     country: result.country,
            //     status: status,
            //     orderOwner: orderOwner,
            //     number: 12,
            //     grandTotal: result.grandTotal,
            //     currency: result.currency,
            //     notifyFor: 'dealer'

            // });

            // await newOrderOperationNotify.save();

            // const order = await Order.findById(orderId);
            // order.number = 10;
            // await order.save();

            // const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            // const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            // io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        }



        res.status(200).json({
            message: status,
            orderTransactions: orderTransactions


        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'approveThis', 1083, 500, err);

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
            .populate({ path: 'customerId', select: 'address taxId fax phone email' })
            .exec();

        const number = order[0].number;


        for (let p of order[0].products) {




            let stock = await Product.find({ _id: ObjectId(p.product._id) }, { stock: 1 });

            p.stock = stock[0].stock;

        }



        const orderTransactions = await OrderTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });


        const orderProductTransactions = await OrderProductTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });




        if (order[0].status == orderStatus.OrderApproved) {

            const checkedDate = Date.now;

            // const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // 

            // const result1 = await WareHouseNotify.updateOne({ _id: warehouseNotify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            // io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


            // const notify = await OrderNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });


            // const result = await OrderNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });


        }

        if (order[0].status == orderStatus.GettingReady) {


            const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            if (notify[0]) {
                const checkedDate = Date.now;
                const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            }

            io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });



        }


        if (order[0].status == orderStatus.WaitingforShipmentApproval) {




            const _orderOperationNotify = await OrderOperationNotify.find({ 'orderId': orderId, $or: [{ number: { $eq: number } }, { number: { $lt: number } }] }).sort({ createdAt: -1 });

            const checkedDate = Date.now;


            for (let n of _orderOperationNotify) {

                const result1 = await OrderOperationNotify.updateOne({ _id: n._id }, { isChecked: true }, { checkedDate: checkedDate });

            }




            io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });

        }


        if (order[0].status == orderStatus.ShipmentApproved) {


            // const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // const checkedDate = Date.now;

            // const result1 = await WareHouseNotify.updateOne({ _id: warehouseNotify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            // io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


            // const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });


            // const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            // io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });
        }

        if (order[0].status == orderStatus.ShipmentSuccessed) {


            const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });
            if (notify[0]) {
                const checkedDate = Date.now;
                const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });
            }

            // const notify1 = await OrderOperationNotify.find({ 'orderId': orderId, isChecked: false, 'number': { "\$lt": notify[0].number } }).sort({ createdAt: -1 });


            // for (const n of notify1) {

            //     await OrderOperationNotify.updateOne({ _id: n._id }, { isChecked: true });

            // }


            io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });

        }


        if (order[0].status == orderStatus.ReservationWanted) {


            // const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // const checkedDate = Date.now;

            // const result1 = await WareHouseNotify.updateOne({ _id: warehouseNotify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            // io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


            // const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });


            // const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            // io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });
        }

        if (order[0].status == orderStatus.ReservationOkay) {


            const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });
            if (notify[0]) {
                const checkedDate = Date.now;
                const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });
            }

            // const notify1 = await OrderOperationNotify.find({ 'orderId': orderId, isChecked: false, 'number': { "\$lt": notify[0].number } }).sort({ createdAt: -1 });


            // for (const n of notify1) {

            //     await OrderOperationNotify.updateOne({ _id: n._id }, { isChecked: true });

            // }


            io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });

        }



        if (order[0].status == orderStatus.CanceledWanted) {


            // const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // const checkedDate = Date.now;

            // const result1 = await WareHouseNotify.updateOne({ _id: warehouseNotify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            // io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


            // const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });


            // const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

            // io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });
        }

        if (order[0].status == orderStatus.CanceledOkay) {


            const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });


            if (notify[0]) {

                const checkedDate = Date.now;
                const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });
            }

            // const notify1 = await OrderOperationNotify.find({ 'orderId': orderId, isChecked: false, 'number': { "\$lt": notify[0].number } }).sort({ createdAt: -1 });


            // for (const n of notify1) {

            //     await OrderOperationNotify.updateOne({ _id: n._id }, { isChecked: true });

            // }


            io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });

        }



        // if (order[0].status == 'Order Canceled') {


        //     const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

        //     const checkedDate = Date.now;
        //     const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });

        //     const notify1 = await OrderOperationNotify.find({ 'orderId': orderId, isChecked: false, 'number': { "\$lt": notify[0].number } }).sort({ createdAt: -1 });



        //     for (const n of notify1) {

        //         await OrderOperationNotify.updateOne({ _id: n._id }, { isChecked: true });

        //     }


        //     io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });


        //     const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

        //     console.log(warehouseNotify)

        //     const result1 = await WareHouseNotify.updateOne({ _id: warehouseNotify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });


        //     const notify2 = await WareHouseNotify.find({ 'orderId': orderId, isChecked: false, 'number': { "\$lt": warehouseNotify[0].number } }).sort({ createdAt: -1 });



        //     for (const n of notify2) {

        //         await WareHouseNotify.updateOne({ _id: n._id }, { isChecked: true });

        //     }


        //     io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });

        // }

        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            order: order[0],
            orderTransactions: orderTransactions,
            orderProductTransactions: orderProductTransactions

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getOrder', 1543, 500, err);

        next(err);
    }

}



/// warehouse 

exports.warehouseApproveThis = async (req, res, next) => {


    const orderId = ObjectId(req.body.orderId);
    const userName = req.body.userName;
    const status = req.body.status;
    const operationalNote = req.body.operationalNote;

    try {

        const order = await Order.findById(orderId);


        const orderOwner = order.owner;
        order.isApproved = true;

        order.status = status;
        order.operationalNote = operationalNote;


        const result = await order.save();



        const orderTransaction = new OrderTransaction({
            orderId: orderId,
            isApproved: true,
            status: status,
            userName: userName
        });


        await orderTransaction.save();

        const orderTransactions = await OrderTransaction.find({ orderId: orderId }).sort({ createdAt: -1 });




        if (status == orderStatus.GettingReady) {

            const newOrderOperationNotify = new OrderOperationNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 3,
                orderOwner: orderOwner,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'dealer'

            });

            await newOrderOperationNotify.save();

            const order = await Order.findById(orderId);
            order.number = 3;
            await order.save();



            const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });







        }

        if (status == orderStatus.WaitingforShipmentApproval) {

            const newOrderOperationNotify = new OrderOperationNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 6,
                orderOwner: orderOwner,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'dealer'

            });

            let notify = await newOrderOperationNotify.save();

            const order = await Order.findById(orderId);
            order.number = 6;
            await order.save();


            // let orderOperationNotifies = await OrderOperationNotify.find({ orderId: order._id, isChecked: false, number: { $lt: notify.number } });

            // for (let n of orderOperationNotifies) {
            //     n.isChecked = true;
            //     await n.save();

            // }


            const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });



        }



        if (status == orderStatus.ShipmentSuccessed) {

            const newOrderOperationNotify = new OrderOperationNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 10,
                orderOwner: orderOwner,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'dealer'

            });

            await newOrderOperationNotify.save();

            const order = await Order.findById(orderId);
            order.number = 10;
            await order.save();



            for (let p of result.products) {


                const productShipmentLog = new ProductShipmentLog({
                    orderId: orderId,
                    customerId: result.customerId,
                    customer: result.customer,
                    country: result.country,
                    status: status,
                    productId: p.product._id,
                    title: p.product.title + '-' + p.product.volume + p.product.volumeEntity,
                    shipmentNumber: p.readyBox,
                    orderNumber: p.box,
                    userName: userName,

                });

                await productShipmentLog.save();


            }




            const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        }



        if (status == orderStatus.ReservationWanted) {



            // const wareHouseNotify = new WareHouseNotify({
            //     orderId: orderId,
            //     customerId: result.customerId,
            //     customer: result.customer,
            //     country: result.country,
            //     status: status,
            //     number: 9,
            //     notifyFor: 'dealer'

            // });

            // await wareHouseNotify.save();

            // const unSeenCount1 = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            // const notifies1 = await WareHouseNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            // io.addNamespace('/warehouse').emit('operation', { status: status, notifies: notifies1, unSeenCount: unSeenCount1 });


        }


        if (status == orderStatus.ReservationOkay) {

            const newOrderOperationNotify = new OrderOperationNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                orderOwner: orderOwner,
                number: 9,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'dealer'

            });



            const _result = await newOrderOperationNotify.save();



            const order = await Order.findById(orderId);
            order.number = 9;
            await order.save();

            const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        }





        if (status == orderStatus.CanceledWanted) {



            const wareHouseNotify = new WareHouseNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                number: 11,
                notifyFor: 'dealer'

            });

            await wareHouseNotify.save();

            const unSeenCount1 = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies1 = await WareHouseNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/warehouse').emit('operation', { status: status, notifies: notifies1, unSeenCount: unSeenCount1 });


        }


        if (status == orderStatus.CanceledOkay) {

            const newOrderOperationNotify = new OrderOperationNotify({
                orderId: orderId,
                customerId: result.customerId,
                customer: result.customer,
                country: result.country,
                status: status,
                orderOwner: orderOwner,
                number: 12,
                grandTotal: result.grandTotal,
                currency: result.currency,
                notifyFor: 'dealer'

            });

            await newOrderOperationNotify.save();

            const order = await Order.findById(orderId);
            order.number = 12;
            await order.save();

            const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
            const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


            io.addNamespace('/operations').emit('operation', { status: status, notifies: notifies, unSeenCount: unSeenCount });

        }



        res.status(200).json({
            message: status,
            orderTransactions: orderTransactions


        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'warehouseApproveThis', 1858, 500, err);

        next(err);
    }

}



exports.warehouseGetOrder = async (req, res, next) => {
    const orderId = ObjectId(req.params.orderId);


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    console.log(orderId);


    try {

        const order = await Order
            .find({ '_id': orderId })
            .populate({ path: 'customerId', select: 'address taxId fax phone email' })
            .exec();




        for (let p of order[0].products) {


            let stock = await Product.find({ _id: ObjectId(p.product._id) }, { stock: 1 });

            p.stock = stock[0].stock;

        }



        const orderTransactions = await OrderTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });


        const orderProductTransactions = await OrderProductTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });




        if (order[0].status == orderStatus.OrderApproved) {



            const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });


            if (warehouseNotify[0]) {

                const checkedDate = Date.now;

                const result1 = await WareHouseNotify.updateOne({ _id: warehouseNotify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });
            }
            io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


        }



        if (order[0].status == orderStatus.GettingReady) {


            const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).sort({ createdAt: -1 });





            for (let notify of warehouseNotify) {

                const checkedDate = Date.now;
                await WareHouseNotify.updateOne({ _id: notify._id }, { isChecked: true }, { checkedDate: checkedDate });


            }


            io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


        }



        if (order[0].status == orderStatus.ShipmentApproved) {


            const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).sort({ createdAt: -1 });


            for (let notify of warehouseNotify) {

                const checkedDate = Date.now;
                await WareHouseNotify.updateOne({ _id: notify._id }, { isChecked: true }, { checkedDate: checkedDate });

            }

            io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });



        }

        if (order[0].status == orderStatus.ShipmentSuccessed) {


            // const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // const checkedDate = Date.now;
            // const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });



            // io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });

        }



        if (order[0].status == orderStatus.ProductNumberChanged) {


            const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            if (warehouseNotify[0]) {
                const checkedDate = Date.now;

                const result1 = await WareHouseNotify.updateOne({ _id: warehouseNotify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });
            }
            io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


        }

        if (order[0].status == orderStatus.ReservationWanted) {


            const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).sort({ createdAt: -1 });
            for (let notify of warehouseNotify) {

                const checkedDate = Date.now;
                await WareHouseNotify.updateOne({ _id: notify._id }, { isChecked: true }, { checkedDate: checkedDate });

            }
            io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });


        }

        if (order[0].status == orderStatus.ReservationOkay) {


            // const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // const checkedDate = Date.now;
            // const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });



            // io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });

        }



        if (order[0].status == orderStatus.CanceledWanted) {


            const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId }).sort({ createdAt: -1 });
            for (let notify of warehouseNotify) {

                const checkedDate = Date.now;
                await WareHouseNotify.updateOne({ _id: notify._id }, { isChecked: true }, { checkedDate: checkedDate });

            }
            io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });




        }

        if (order[0].status == orderStatus.CanceledOkay) {


            // const notify = await OrderOperationNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

            // const checkedDate = Date.now;
            // const result = await OrderOperationNotify.updateOne({ _id: notify[0]._id }, { isChecked: true }, { checkedDate: checkedDate });



            // io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });

        }




        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            order: order[0],
            orderTransactions: orderTransactions,
            orderProductTransactions: orderProductTransactions

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        errorService.sendErrorNotificationViaEmail('orderController', 'warehouseGetOrder', 2182, 500, err);

        next(err);
    }

}



exports.getChangeOrderOwner = async (req, res, next) => {
    const orderId = ObjectId(req.params.orderId);
    const userName = req.params.username;




    try {


        await Order.updateOne({ _id: orderId }, { owner: userName });



        res.status(200).json({
            message: 'order owner changed'

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getChangeOrderOwner', 2406, 500, err);

        next(err);
    }

}

exports.getOrderAfterAddon = async (req, res, next) => {
    const orderId = ObjectId(req.params.orderId);


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        const order = await Order
            .find({ '_id': orderId })
            .populate({ path: 'customerId', select: 'address taxId fax phone email' })
            .exec();


        for (let p of order[0].products) {

            let stock = await Product.find({ _id: ObjectId(p.product._id) }, { stock: 1 });

            p.stock = stock[0].stock;

        }


        const orderTransactions = await OrderTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });


        const orderProductTransactions = await OrderProductTransaction
            .find({ 'orderId': orderId }).sort({ createdAt: -1 });



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            order: order[0],
            orderTransactions: orderTransactions,
            orderProductTransactions: orderProductTransactions

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getOrderAfterAddon', 2436, 500, err);

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
        errorService.sendErrorNotificationViaEmail('orderController', 'dashboard', 2490, 500, err);

        next(err);
    }

}


exports.updateBillingAddress = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {


        const order = await Order.findById(orderId);
        order.billingAddress = req.body;
        await order.save();

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'updateBillingAddress', 2519, 500, err);

        next(err);
    }

}


exports.updateDeliveryAddress = async (req, res, next) => {
    const orderId = req.params.orderId;
    try {


        const order = await Order.findById(orderId);

        order.deliveryAddress = req.body;

        await order.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'updateDeliveryAddress', 2541, 500, err);

        next(err);
    }

}

exports.savePromotion = async (req, res, next) => {

    const orderId = req.params.orderId;
    const userName = req.params.username;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    try {

        let product = new PromotionProduct({

            orderId: orderId,
            productId: req.body._id,
            title: req.body.title,
            turkishTitle: req.body.turkishTitle,
            imageUrl: req.body.imageUrl,
            volume: req.body.volume,
            volumeEntity: req.body.volumeEntity,
            quantityInBox: req.body.quantityInBox,
            grossWeight: req.body.grossWeight,
            grossEntity: req.body.grossEntity,
            boxWidth: req.body.boxWidth,
            boxLength: req.body.boxLength,
            boxHeight: req.body.boxHeight,
            boxEntity: req.body.boxEntity,
            unitPrice: req.body.unitPrice,
            unit: req.body.unit,
            box: req.body.box,
            totalPrice: req.body.totalPrice,
            currency: req.body.currency,
            emptyBoxWeight: req.body.emptyBoxWeight,
            categoryName: req.body.categoryName,
            categoryNameLower: req.body.categoryNameLower,
            status: 'Eklenecek'

        });



        const result = await product.save();


        let order = await Order.findById(orderId);

        order.promotionProductNumber += product.unit;
        order.promotionProductTotalPrice += product.totalPrice;

        order.totalProduct += product.unit;
        order.grandTotal += product.totalPrice;

        order.grandTotal = order.grandTotal.toFixed(2);




        await order.save();





        const orderProductTransaction = new OrderProductTransaction({
            orderId: orderId,
            productId: product.productId,
            imageUrl: product.imageUrl,
            product: product.title + ' ' + product.volume + product.volumeEntity,
            productNumber: product.box,
            operation: orderStatus.PromotionAdded,
            userName: userName
        });

        await orderProductTransaction.save();



        const wareHouseNotify = new WareHouseNotify({
            orderId: orderId,
            customerId: req.body.customerId,
            customer: req.body.customer,
            country: req.body.country,
            status: orderStatus.PromotionsChanged,
            number: 6,
            notifyFor: 'dealer'

        });

        await wareHouseNotify.save();

        const unSeenCount1 = await WareHouseNotify.find({ 'status': "Promotions Changed", isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies1 = await WareHouseNotify.find({ 'status': "Promotions Changed", 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/warehouse').emit('operation', { status: "Promotions Changed", notifies: notifies1, unSeenCount: unSeenCount1 });




        res.status(200).json({ message: orderStatus.PromotionsChanged });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'savePromotion', 2562, 500, err);

        next(err);
    }
};

exports.getPromotionProducts = async (req, res, next) => {

    const orderId = req.params.orderId;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    try {

        const promotionProducts = await PromotionProduct.find({ 'orderId': ObjectId(orderId) });

        res.status(200).json({ message: 'Promotion Products', promotionProducts: promotionProducts });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getPromotionProducts', 2674, 500, err);

        next(err);
    }
};


exports.changeEstimatedDate = async (req, res, next) => {

    const orderId = req.params.orderId;
    const day = req.params.day;
    const month = req.params.month;
    const year = req.params.year;
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    try {



        let estimatedDate = new Date(year + "-" + month + "-" + day);

        estimatedDate.setDate(estimatedDate.getDate() + 1);


        const order = await Order.findById(ObjectId(orderId));


        order.estimatedDate = estimatedDate;

        const result = await order.save();


        res.status(200).json({ message: 'Estimated date updated' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'changeEstimatedDate', 2700, 500, err);

        next(err);
    }
};

exports.deletePromotionProducts = async (req, res, next) => {


    const _id = req.params.id;
    const userName = req.params.username;
    const customerId = req.params.customerid;
    const customer = req.params.customer;
    const country = req.params.country;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    try {



        let promotionProduct = await PromotionProduct.findById(_id);

        promotionProduct.status = 'Cikarilacak';

        await promotionProduct.save();


        const orderProductTransaction = new OrderProductTransaction({
            orderId: promotionProduct.orderId,
            productId: promotionProduct.productId,
            imageUrl: promotionProduct.imageUrl,
            product: promotionProduct.title + ' ' + promotionProduct.volume + promotionProduct.volumeEntity,
            productNumber: promotionProduct.box,
            operation: orderStatus.RemovedPromotion,
            userName: userName
        });

        const result = await orderProductTransaction.save();

        const wareHouseNotify = new WareHouseNotify({
            orderId: promotionProduct.orderId,
            customerId: customerId,
            customer: customer,
            country: country,
            status: orderStatus.PromotionsChanged,
            number: 6,
            notifyFor: 'dealer'

        });

        await wareHouseNotify.save();

        const unSeenCount1 = await WareHouseNotify.find({ 'status': orderStatus.PromotionsChanged, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies1 = await WareHouseNotify.find({ 'status': orderStatus.PromotionsChanged, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/warehouse').emit('operation', { status: orderStatus.PromotionsChanged, notifies: notifies1, unSeenCount: unSeenCount1 });



        res.status(200).json({ message: orderStatus.PromotionsChanged });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'deletePromotionProducts', 2740, 500, err);

        next(err);
    }
};



exports.deletePromotionProductsGiveBackToStock = async (req, res, next) => {


    const _id = req.params.id;
    const userName = req.params.username;
    const customerId = req.params.customerid;
    const customer = req.params.customer;
    const country = req.params.country;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    try {


        const promotionProduct = await PromotionProduct.findById(_id);



        const order = await Order.findById(promotionProduct.orderId);

        order.promotionProductNumber -= promotionProduct.unit;
        order.promotionProductTotalPrice -= promotionProduct.totalPrice;

        order.totalProduct -= promotionProduct.unit;
        order.grandTotal -= promotionProduct.totalPrice

        await order.save();

        let product = await Product.findById(promotionProduct.productId);

        product.stock += promotionProduct.unit;
        await product.save();

        await PromotionProduct.findByIdAndDelete(_id);


        const orderProductTransaction = new OrderProductTransaction({
            orderId: promotionProduct.orderId,
            productId: promotionProduct.productId,
            imageUrl: promotionProduct.imageUrl,
            product: promotionProduct.title + ' ' + promotionProduct.volume + promotionProduct.volumeEntity,
            productNumber: promotionProduct.box,
            operation: orderStatus.PromotionRemovedByWarehouse,
            userName: userName
        });

        const result = await orderProductTransaction.save();


        const newOrderOperationNotify = new OrderOperationNotify({
            orderId: promotionProduct.orderId,
            customerId: order.customerId,
            customer: order.customer,
            country: order.country,
            status: orderStatus.PromotionsChanged,
            orderOwner: order.owner,
            number: 6,
            grandTotal: order.grandTotal.toFixed(2),
            currency: order.currency,
            notifyFor: 'dealer'

        });

        await newOrderOperationNotify.save();


        order.number = 6;
        await order.save();

        const unSeenCount = await OrderOperationNotify.find({ 'status': newOrderOperationNotify.status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies = await OrderOperationNotify.find({ 'status': newOrderOperationNotify.status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/operations').emit('operation', { status: newOrderOperationNotify.status, notifies: notifies, unSeenCount: unSeenCount });



        // const unSeenCount1 = await WareHouseNotify.find({ 'status': "Promotions Changed", isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        // const notifies1 = await WareHouseNotify.find({ 'status': "Promotions Changed", 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        // io.addNamespace('/warehouse').emit('operation', { status: "Promotions Changed", notifies: notifies1, unSeenCount: unSeenCount1 });



        res.status(200).json({ message: 'Promotion Products' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'deletePromotionProductsGiveBackToStock', 2812, 500, err);

        next(err);
    }
};

exports.promotionProductAddedByWarehouse = async (req, res, next) => {


    const _id = req.params.id;
    const userName = req.params.username;
    const customerId = req.params.customerid;
    const customer = req.params.customer;
    const country = req.params.country;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    try {


        let promotionProduct = await PromotionProduct.findById(_id);

        promotionProduct.status = 'Eklendi'
        await promotionProduct.save();



        const _order = await Order.findById(promotionProduct.orderId);



        const orderProductTransaction = new OrderProductTransaction({
            orderId: promotionProduct.orderId,
            productId: promotionProduct.productId,
            imageUrl: promotionProduct.imageUrl,
            product: promotionProduct.title + ' ' + promotionProduct.volume + promotionProduct.volumeEntity,
            productNumber: promotionProduct.box,
            operation: orderStatus.PromotionAddedByWarehouse,
            userName: userName
        });

        const result = await orderProductTransaction.save();


        const newOrderOperationNotify = new OrderOperationNotify({
            orderId: promotionProduct.orderId,
            customerId: _order.customerId,
            customer: _order.customer,
            country: _order.country,
            status: orderStatus.PromotionsChanged,
            orderOwner: _order.orderOwner,
            number: 6,
            grandTotal: _order.grandTotal.toFixed(2),
            currency: _order.currency,
            notifyFor: 'dealer'

        });

        await newOrderOperationNotify.save();


        _order.number = 6;
        await _order.save();

        const unSeenCount = await OrderOperationNotify.find({ 'status': newOrderOperationNotify.status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies = await OrderOperationNotify.find({ 'status': newOrderOperationNotify.status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/operations').emit('operation', { status: newOrderOperationNotify.status, notifies: notifies, unSeenCount: unSeenCount });


        res.status(200).json({ message: 'Promotion Products' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'promotionProductAddedByWarehouse', 2912, 500, err);

        next(err);
    }
};

exports.addProductToOrder = async (req, res, next) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    try {


        const newDate = Date.now();

        const order = await Order
            .findById(orderId);


        const _stock = await Product.findById(req.body._id).stock;



        var product = {

            readyBox: 0,
            readyUnit: 0,
            stock: _stock,
            status: "",
            product: {
                image: [],
                _id: req.body._id,
                title: req.body.title,
                turkishTitle: req.body.turkishTitle,
                volume: req.body.volume,
                volumeEntity: req.body.volumeEntity,
                quantityInBox: req.body.quantityInBox,
                grossWeight: req.body.grossWeight,
                grossEntity: req.body.grossEntity,
                boxWidth: req.body.boxWidth,
                boxLength: req.body.boxLength,
                boxHeight: req.body.boxHeight,
                boxEntity: req.body.boxEntity,
                emptyBoxWeight: req.body.emptyBoxWeight,
                categoryName: req.body.categoryName,
                categoryNameLower: req.body.categoryNameLower
            },
            unitPrice: Number(req.body.unitPrice),
            unit: Number(req.body.unit),
            box: Number(req.body.box),
            totalPrice: Number(req.body.totalPrice),
            currency: req.body.currency,
            createdAt: newDate,
            canceled: false

        }
        product.product.image.push(req.body.imageUrl);


        found = false;



        console.log(product);


        for (const p of order.products) {


            if (p.product._id.toString() === req.body._id.toString()) {


                console.log("totalPrice : " + product.totalPrice)

                p.unit += product.unit;
                p.box += product.box;
                p.totalPrice += product.totalPrice;

                if (p.status != "") {
                    p.status = "Hazırlanıyor";
                }


                found = true;


            }

        }



        if (found == true) {

            let oldOrder = await Order
                .findById(orderId);
            oldOrder.products = order.products;
            oldOrder.totalProduct = 0;
            oldOrder.grandTotal = 0;
            for (const p of oldOrder.products) {

                oldOrder.totalProduct += p.unit;
                oldOrder.grandTotal += p.totalPrice;

            }

            oldOrder.originTotalProduct = oldOrder.totalProduct;
            oldOrder.originGrandTotal = oldOrder.grandTotal;

            oldOrder.save();




        } else {



            order.grandTotal += Number(req.body.totalPrice);
            order.totalProduct += Number(req.body.unit);
            order.grandTotal = order.grandTotal.toFixed(2);

            order.originTotalProduct = order.totalProduct;
            order.originGrandTotal = order.grandTotal;
            order.products.push(product);
            order.save();

        }








        const orderProductTransaction = new OrderProductTransaction({
            orderId: req.body.orderId,
            productId: req.body.productId,
            imageUrl: req.body.imageUrl,
            product: req.body.title + ' ' + req.body.volume + req.body.volumeEntity,
            productNumber: req.body.box,
            operation: req.body.operation,
            userName: req.body.userName
        });

        const result = await orderProductTransaction.save();



        console.log(order.customerId)


        // const newOrderOperationNotify = new OrderOperationNotify({
        //     orderId: orderId,
        //     customerId: order.customerId,
        //     customer: order.customer,
        //     country: order.country,
        //     status: "Product Number Changed",
        //     grandTotal: order.grandTotal,
        //     currency: order.currency,
        //     notifyFor: 'dealer'

        // });

        // await newOrderOperationNotify.save();



        // const unSeenCount = await OrderOperationNotify.find({ 'status': newOrderOperationNotify.status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        // const notifies = await OrderOperationNotify.find({ 'status': newOrderOperationNotify.status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        // io.addNamespace('/operations').emit('operation', { status: newOrderOperationNotify.status, notifies: notifies, unSeenCount: unSeenCount });



        const wareHouseNotify = new WareHouseNotify({
            orderId: orderId,
            customerId: order.customerId,
            customer: order.customer,
            country: order.country,
            status: orderStatus.ProductNumberChanged,
            number: 6,
            notifyFor: 'dealer'

        });

        await wareHouseNotify.save();

        const unSeenCount1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/warehouse').emit('operation', { status: orderStatus.ProductNumberChanged, notifies: notifies1, unSeenCount: unSeenCount1 });






        res.status(200).json({ message: 'Product added' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'addProductToOrder', 2992, 500, err);

        next(err);
    }
};


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
        errorService.sendErrorNotificationViaEmail('orderController', 'postStatus', 3205, 500, err);

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
        errorService.sendErrorNotificationViaEmail('orderController', 'postOrderProductTransaction', 3265, 500, err);

        next(err);
    }
};

exports.operation = async (req, res, next) => {


    try {

        let volume;
        let volumeEntity;

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




        let _order = await Order.findById(ObjectId(orderId));




        if (operation === 'Eklendi') {

            let _totalProduct = 0;
            let _grandTotal = 0;

            for (const p of _order.products) {
                if (p.product._id === productId) {

                    p.box += Number(newProductBoxNumber);
                    p.unit += Number(newProductBoxNumber) * Number(quantityInBox);
                    p.totalPrice = Number(p.unit * p.unitPrice).toFixed(2);
                    p.totalPrice = Number(p.totalPrice);
                    volume = p.volume;
                    volumeEntity = p.volumeEntity;

                    if (p.status === 'Tamamlandı') {

                        if (newProductBoxNumber != 0) {
                            p.status = "Hazırlanıyor";
                        }

                    }


                }

                _totalProduct += Number(p.unit);
                _grandTotal += Number(p.totalPrice);
            }


            _order.totalProduct = _totalProduct;
            _order.grandTotal = _grandTotal;

        }
        if (operation === 'Cikarildi') {
            let _totalProduct = 0;
            let _grandTotal = 0;
            for (const p of _order.products) {
                if (p.product._id === productId) {

                    p.box -= Number(newProductBoxNumber);
                    p.unit -= Number(newProductBoxNumber) * Number(quantityInBox);
                    p.totalPrice = Number(p.unit * p.unitPrice).toFixed(2);
                    p.totalPrice = Number(p.totalPrice);
                    volume = p.volume;
                    volumeEntity = p.volumeEntity;
                    if (p.status === 'Tamamlandı') {

                        if (newProductBoxNumber != 0) {
                            p.status = "Hazırlanıyor";
                        }

                    }

                    if (p.readyBox === p.box) {
                        p.status = 'Tamamlandı';
                    }




                }

                _totalProduct += Number(p.unit);
                _grandTotal += Number(p.totalPrice);

            }

            _order.totalProduct = _totalProduct;
            _order.grandTotal = Number(_grandTotal).toFixed(2);;
        }



        let oldOrder = await Order.findById(ObjectId(orderId));

        oldOrder.products = _order.products;
        oldOrder.totalProduct = _order.totalProduct;
        oldOrder.grandTotal = _order.grandTotal;

        let _orderProductResult = await oldOrder.save();




        const orderProductTransaction = new OrderProductTransaction({
            orderId: req.body.orderId,
            productId: req.body.productId,
            imageUrl: imageUrl,
            product: req.body.productTitle + ' ' + volume + volumeEntity,
            productNumber: req.body.newProductBoxNumber,
            operation: req.body.operation,
            userName: req.body.userName
        });

        const result = await orderProductTransaction.save();

        const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });




        const wareHouseNotify = new WareHouseNotify({
            orderId: orderId,
            customerId: _order.customerId,
            customer: _order.customer,
            country: _order.country,
            status: orderStatus.ProductNumberChanged,
            number: 6,
            notifyFor: 'dealer'

        });

        await wareHouseNotify.save();



        const unSeenCount1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/warehouse').emit('operation', { status: orderStatus.ProductNumberChanged, notifies: notifies1, unSeenCount: unSeenCount1 });





        res.status(201).json({
            statusCode: 201, message: 'Transaction created!',
            order: _orderProductResult,
            orderProductTransactions: orderProductTransactions
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'operation', 3303, 500, err);

        next(err);
    }
};

exports.warehouseOperation = async (req, res, next) => {


    try {

        let volume;
        let volumeEntity;


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


        console.log("orderId : " + orderId)
        console.log("productId : " + productId)
        console.log("imageUrl : " + imageUrl)
        console.log("product : " + product)
        console.log("newProductNumber : " + newProductNumber)
        console.log("operation : " + operation)
        console.log("userName : " + userName)
        console.log("newProductBoxNumber : " + newProductBoxNumber)
        console.log("orderProductBoxNumber : " + orderProductBoxNumber)
        console.log("quantityInBox : " + quantityInBox)



        let _order = await Order.findById(ObjectId(orderId));

        if (operation === 'Eklendi') {

            for (const p of _order.products) {


                if (p.product._id === productId) {

                    p.readyBox += Number(newProductBoxNumber);
                    p.readyUnit += Number(newProductBoxNumber) * Number(quantityInBox);
                    volume = p.product.volume;
                    volumeEntity = p.product.volumeEntity;
                    if (p.readyBox == p.box) {
                        p.status = 'Tamamlandı';
                    }

                    if (p.readyBox < p.box) {
                        p.status = 'Hazırlanıyor';
                    }
                    let _product = await Product.findById(p.product._id);


                    _product.stock -= Number(newProductBoxNumber) * Number(quantityInBox);

                    await _product.save();
                    p.stock = _product.stock;

                }
                let _product = await Product.findById(p.product._id);
                p.stock = _product.stock;


            }


        }
        if (operation === 'Cikarildi') {
            let _totalProduct = 0;
            let _grandTotal = 0;
            for (const p of _order.products) {
                if (p.product._id === productId) {

                    p.readyBox -= Number(newProductBoxNumber);
                    p.readyUnit -= Number(newProductBoxNumber) * Number(quantityInBox);
                    volume = p.product.volume;
                    volumeEntity = p.product.volumeEntity;




                    if (p.readyBox < p.box) {

                        if (p.canceled != true) {
                            p.status = 'Hazırlanıyor';
                        }

                    }

                    if (p.readyBox == p.box) {

                        if (p.canceled != true) {
                            p.status = 'Tamamlandı';
                        }

                    }

                    if (p.readyBox == 0) {
                        if (p.canceled != true) {
                            p.status = '';
                        }
                    }

                    let _product = await Product.findById(p.product._id);
                    _product.stock += Number(newProductBoxNumber) * Number(quantityInBox);
                    await _product.save();
                    p.stock = _product.stock;

                }

            }

        }





        let oldOrder = await Order.findById(ObjectId(orderId));

        oldOrder.products = _order.products;

        let _orderProductResult = await oldOrder.save();


        const orderProductTransaction = new OrderProductTransaction({
            orderId: req.body.orderId,
            productId: req.body.productId,
            imageUrl: imageUrl,
            product: req.body.productTitle + ' ' + volume + volumeEntity,
            productNumber: req.body.newProductBoxNumber,
            operation: 'depodan-' + req.body.operation,
            userName: req.body.userName
        });


        console.log("depodan " + volume + ' ' + volumeEntity)

        const result = await orderProductTransaction.save();

        const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });


        // console.log(_orderProductResult)

        res.status(201).json({
            statusCode: 201, message: 'Transaction created!',
            order: _orderProductResult,
            orderProductTransactions: orderProductTransactions
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'warehouseOperation', 3487, 500, err);

        next(err);
    }
};


exports.warehouseRetailerOperation = async (req, res, next) => {


    try {

        let volume;
        let volumeEntity;


        const orderId = req.body.orderId;
        const productId = req.body.productId;
        const imageUrl = req.body.imageUrl;
        const product = req.body.productTitle;
        const stockCode = req.body.stockCode;
        const operation = req.body.operation;
        const userName = req.body.userName;
        const newProductUnitNumber = req.body.newProductUnitNumber;

        const orderProductUnitNumber = req.body.orderProductUnitNumber;
        const quantityInBox = req.body.quantityInBox;


        console.log("orderId : " + orderId)
        console.log("productId : " + productId)
        console.log("imageUrl : " + imageUrl)
        console.log("product : " + product)
        console.log("stockCode : " + stockCode)
        console.log("operation : " + operation)
        console.log("userName : " + userName)
        console.log("newProductUnitNumber : " + newProductUnitNumber)
        console.log("orderProductUnitNumber : " + orderProductUnitNumber)
        console.log("quantityInBox : " + quantityInBox)


        let _order = await OrderRetailer.findById(ObjectId(orderId));



        if (operation === 'Eklendi') {

            for (const p of _order.products) {

                if (p.product._id === productId) {

                    volume = p.volume;
                    volumeEntity = p.volumeEntity;

                    p.readyUnitNumber += Number(newProductUnitNumber);

                    if (p.readyUnitNumber === p.unit) {
                        p.productStatus = 'Tamamlandı';
                    }

                    if (p.readyUnitNumber < p.unit) {
                        p.productStatus = 'Hazırlanıyor';
                    }

                    let _product = await Product.findById(p.product._id);

                    if (_product.colors.length != 0) {
                        for (let color of _product.colors) {
                            if (color.stockCode === stockCode) {
                                let currentStock = Number(color.stock);
                                currentStock -= Number(newProductUnitNumber);
                                color.stock = currentStock;
                                let __product = await Product.findById(p.product._id);
                                __product.colors = _product.colors;
                                await __product.save();
                                p.stock = currentStock;
                            }
                        }
                    }

                    if (_product.sizes.length != 0) {
                        for (let size of _product.sizes) {
                            if (size.stockCode === stockCode) {
                                let currentStock = Number(size.stock);
                                currentStock -= Number(newProductUnitNumber);
                                size.stock = currentStock;
                                let __product = await Product.findById(p.product._id);
                                __product.sizes = _product.sizes;
                                await __product.save();
                                p.stock = currentStock;
                            }
                        }
                    }
                }
            }
        }



        if (operation === 'Cikarildi') {
            let _totalProduct = 0;
            let _grandTotal = 0;
            for (const p of _order.products) {
                if (p.product._id === productId) {

                    volume = p.volume;
                    volumeEntity = p.volumeEntity;


                    p.readyUnitNumber -= Number(newProductUnitNumber);

                    if (p.readyUnitNumber < p.unit) {

                        if (p.canceled != true) {
                            p.productStatus = 'Hazırlanıyor';
                        }

                    }

                    if (p.readyUnitNumber == p.unit) {

                        if (p.canceled != true) {
                            p.productStatus = 'Tamamlandı';
                        }

                    }

                    if (p.readyUnitNumber == 0) {
                        if (p.canceled != true) {
                            p.productStatus = '';
                        }
                    }

                    let _product = await Product.findById(p.product._id);

                    if (_product.colors.length != 0) {
                        for (let color of _product.colors) {
                            if (color.stockCode === stockCode) {
                                let currentStock = Number(color.stock);
                                currentStock += Number(newProductUnitNumber);
                                color.stock = currentStock;
                                let __product = await Product.findById(p.product._id);
                                __product.colors = _product.colors;
                                await __product.save();
                                p.stock = currentStock;

                            }
                        }
                    }

                    if (_product.sizes.length != 0) {
                        for (let size of _product.sizes) {
                            if (size.stockCode === stockCode) {
                                let currentStock = Number(size.stock);
                                currentStock -= Number(newProductUnitNumber);
                                size.stock = currentStock;
                                let __product = await Product.findById(p.product._id);
                                __product.sizes = _product.sizes;
                                await __product.save();
                                p.stock = currentStock;
                            }
                        }
                    }
                }
            }
        }


        let oldOrder = await OrderRetailer.findById(ObjectId(orderId));

        oldOrder.products = _order.products;

        let _orderProductResult = await oldOrder.save();


        const orderProductRetailerTransaction = new OrderProductRetailerTransaction({
            orderId: req.body.orderId,
            productId: req.body.productId,
            imageUrl: imageUrl,
            product: req.body.productTitle + ' ' + volume + volumeEntity,
            productNumber: req.body.newProductUnitNumber,
            operation: 'depodan-' + req.body.operation,
            userName: req.body.userName
        });


        // console.log("depodan " + volume + ' ' + volumeEntity)

        const result = await orderProductRetailerTransaction.save();

        // const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });






        res.status(201).json({
            statusCode: 201, message: 'Transaction created!',
            orderProduct: _orderProductResult.products

        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'warehouseRetailerOperation', 3654, 500, err);

        next(err);
    }
};


// exports.operation = async (req, res, next) => {


//     try {


//         const orderId = req.body.orderId;
//         const productId = req.body.productId;
//         const imageUrl = req.body.imageUrl;
//         const product = req.body.productTitle;

//         const operation = req.body.operation;
//         const userName = req.body.userName;
//         const newProductBoxNumber = req.body.newProductBoxNumber;
//         const newProductNumber = Number(req.body.newProductBoxNumber) * Number(req.body.quantityInBox);
//         const orderProductBoxNumber = req.body.orderProductBoxNumber;
//         const quantityInBox = req.body.quantityInBox;


//         console.log("orderId : " + orderId)
//         console.log("productId : " + productId)
//         console.log("imageUrl : " + imageUrl)
//         console.log("product : " + product)
//         console.log("newProductNumber : " + newProductNumber)
//         console.log("operation : " + operation)
//         console.log("userName : " + userName)
//         console.log("newProductBoxNumber : " + newProductBoxNumber)
//         console.log("orderProductBoxNumber : " + orderProductBoxNumber)
//         console.log("quantityInBox : " + quantityInBox)




//         let _order = await Order.findById(ObjectId(orderId));

//         let _product = await Product.findById(ObjectId(productId));

//         for (const p of _order.products) {
//             let _product = await Product.findById(p.product._id);
//             p.stock = _product.stock;
//             p.canceled = false;

//         }


//         if (operation === 'Eklendi') {

//             for (const p of _order.products) {
//                 if (p.product._id.toString() === _product._id.toString()) {

//                     p.readyBox = Number(p.readyBox) + Number(newProductBoxNumber);
//                     p.readyUnit = p.readyUnit + newProductNumber;

//                     p.status = "Hazırlanıyor";
//                     if (p.readyBox === p.box) {
//                         p.status = "Tamamlandı";
//                     }

//                     p.stock -= newProductNumber;
//                     _product.stock -= newProductNumber;
//                 }
//             }




//         }
//         if (operation === 'Cikarildi') {
//             for (const p of _order.products) {
//                 if (p.product._id.toString() === _product._id.toString()) {


//                     p.readyBox = Number(p.readyBox) - Number(newProductBoxNumber);
//                     p.readyUnit = p.readyUnit - newProductNumber;
//                     if (p.readyBox === 0) {
//                         p.status = "";
//                     }

//                     p.stock += newProductNumber;
//                     _product.stock += newProductNumber;

//                 }
//             }

//         }


//         let oldOrder = await Order.findById(ObjectId(orderId));
//         oldOrder.products = _order.products;


//         let _orderProductResult = await oldOrder.save();

//         await _product.save();





//         const orderProductTransaction = new OrderProductTransaction({
//             orderId: req.body.orderId,
//             productId: req.body.productId,
//             imageUrl: imageUrl,
//             product: req.body.productTitle,
//             productNumber: req.body.newProductBoxNumber,
//             operation: req.body.operation,
//             userName: req.body.userName
//         });

//         const result = await orderProductTransaction.save();

//         const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });



//         res.status(201).json({
//             statusCode: 201, message: 'Transaction created!',
//             order: _orderProductResult,
//             orderProductTransactions: orderProductTransactions
//         });

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };


exports.postCanceled = async (req, res, next) => {




    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    let productTitle;
    let productImageUrl;
    let volume;
    let volumeEntity;


    let _orderResult;
    try {


        const orderId = req.body.orderId;
        const productId = req.body.productId;
        const unit = req.body.unit;
        const unitPrice = req.body.unitPrice;
        const box = req.body.box;
        // const orderDate = req.body.orderDate;
        const totalPrice = req.body.totalPrice;
        const currency = req.body.currency;
        const userName = req.body.userName;
        const operation = req.body.operation;
        const readyProductBoxNumber = req.body.readyProductBoxNumber;


        console.log("orderId" + orderId);
        console.log("productId" + productId);
        console.log("unit" + unit);
        console.log("unitPrice" + unitPrice);
        console.log("box" + box);
        console.log("totalPrice" + totalPrice);
        console.log("operation" + operation);
        console.log("readyProductBoxNumber" + readyProductBoxNumber);



        let _order = await Order.findById(ObjectId(orderId));


        let _totalProduct = 0;
        let _grandTotal = 0;

        for (const p of _order.products) {
            _totalProduct += Number(p.unit);
            _grandTotal += Number(p.totalPrice);
            if (p.product._id === productId) {

                _totalProduct -= p.unit;
                _grandTotal -= p.totalPrice;




                productTitle = p.product.title;
                productImageUrl = p.product.image[0];
                volume = p.volume;
                volumeEntity = p.volumeEntity;


                p.canceled = true;
                p.status = "Canceled";
            }
        }


        _order.totalProduct = _totalProduct;
        _order.grandTotal = _grandTotal;


        let oldOrder = await Order.findById(ObjectId(orderId));

        oldOrder.products = _order.products;
        oldOrder.totalProduct = _order.totalProduct;
        oldOrder.grandTotal = _order.grandTotal;

        let _orderProductResult = await oldOrder.save();


        const orderProductTransaction = new OrderProductTransaction({
            orderId: orderId,
            productId: productId,
            imageUrl: productImageUrl,
            product: productTitle + ' ' + volume + volumeEntity,
            productNumber: box,
            operation: operation,
            userName: userName,
            canceled: true
        });

        await orderProductTransaction.save();

        // }

        const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });



        const wareHouseNotify = new WareHouseNotify({
            orderId: orderId,
            customerId: _order.customerId,
            customer: _order.customer,
            country: _order.country,
            status: orderStatus.ProductNumberChanged,
            number: 6,
            notifyFor: 'dealer'

        });

        await wareHouseNotify.save();



        const unSeenCount1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/warehouse').emit('operation', { status: orderStatus.ProductNumberChanged, notifies: notifies1, unSeenCount: unSeenCount1 });


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
        errorService.sendErrorNotificationViaEmail('orderController', 'postCanceled', 3991, 500, err);

        next(err);
    }
};




// exports.postCanceled = async (req, res, next) => {




//     // const errors = validationResult(req);
//     // if (!errors.isEmpty()) {
//     //     const error = new Error('Validation failed');
//     //     error.statusCode = 422;
//     //     error.data = errors.array();
//     //     throw error;
//     // }

//     let productTitle;
//     let productImageUrl;

//     let _orderProductResult;
//     let _orderResult;
//     try {


//         const orderId = req.body.orderId;
//         const productId = req.body.productId;
//         const unit = req.body.unit;
//         const unitPrice = req.body.unitPrice;
//         const box = req.body.box;
//         // const orderDate = req.body.orderDate;
//         const totalPrice = req.body.totalPrice;
//         const currency = req.body.currency;
//         const userName = req.body.userName;
//         const operation = req.body.operation;
//         const readyProductBoxNumber = req.body.readyProductBoxNumber;


//         console.log("orderId" + orderId);
//         console.log("productId" + productId);
//         console.log("unit" + unit);
//         console.log("unitPrice" + unitPrice);
//         console.log("box" + box);
//         console.log("totalPrice" + totalPrice);
//         console.log("operation" + operation);
//         console.log("readyProductBoxNumber" + readyProductBoxNumber);



//         let unitNumber = unit;


//         if (Number(readyProductBoxNumber) !== 0) {
//             unitNumber = (unit / box) * readyProductBoxNumber;
//         }



//         let order = await Order.findById(orderId);

//         for (const p of order.products) {

//             let _product = await Product.findById(ObjectId(p.product._id));

//             p.stock = _product.stock;

//             if (p.product._id.toString() === productId.toString()) {

//                 if (Number(readyProductBoxNumber) !== 0) {
//                     p.stock = p.stock + unitNumber;
//                     _product.stock += unitNumber;
//                     console.log(_product.stock)
//                     await _product.save();
//                 }


//                 productTitle = p.product.title;
//                 productImageUrl = p.product.image[0];

//                 p.readyBox = 0;
//                 p.readyUnit = 0;
//                 p.status = operation;
//                 p.canceled = true;


//                 order.grandTotal = order.grandTotal - p.totalPrice;
//                 order.totalProduct = order.totalProduct - unit;


//             }
//         }


//         // console.log(order)

//         let oldOrder = await Order.findById(orderId);
//         oldOrder = order;
//         await oldOrder.save();



//         let oldOrder2 = await Order.findById(orderId);
//         oldOrder2.products = order.products;
//         _orderProductResult = await oldOrder2.save();




//         const orderProductTransaction = new OrderProductTransaction({
//             orderId: orderId,
//             productId: productId,
//             imageUrl: productImageUrl,
//             product: productTitle,
//             productNumber: unitNumber,
//             operation: operation,
//             userName: userName,
//             canceled: true
//         });

//         await orderProductTransaction.save();

//         // }

//         const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });


//         res.status(201).json({
//             statusCode: 201, message: 'Canceled!',
//             orderProduct: _orderProductResult,
//             orderResult: _orderResult,
//             orderProductTransactions: orderProductTransactions
//         });

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };


exports.undo = async (req, res, next) => {


    try {

        let productTitle;
        let productImageUrl;
        let volume;
        let volumeEntity;


        const orderId = req.params.orderId;
        const productId = req.params.productId;
        const userName = req.params.userName;


        console.log("orderId : " + orderId)
        console.log("productId : " + productId)


        let productTotalPrice;
        let productUnitNumber;



        let _order = await Order.findById(ObjectId(orderId));

        for (const p of _order.products) {

            if (p.product._id.toString() === productId.toString()) {




                let _product = await Product.findById(p.product._id);
                p.stock = _product.stock;
                p.canceled = false;
                p.status = "";
                productTotalPrice = p.totalPrice;
                productUnitNumber = Number(p.box) * Number(p.product.quantityInBox);
                productTitle = _product.title;
                productImageUrl = _product.image[0];
                volume = p.volume;
                volumeEntity = p.volumeEntity;
            }

        }



        _order.totalProduct += productUnitNumber;
        _order.grandTotal += productTotalPrice;



        let oldOrder2 = await Order.findById(ObjectId(orderId));
        oldOrder2.products = _order.products;
        await oldOrder2.save();


        let oldOrder = await Order.findById(ObjectId(orderId));
        oldOrder = _order;
        _orderProductResult = await oldOrder.save();






        // console.log(_orderProductResult);




        const orderProductTransaction = new OrderProductTransaction({
            orderId: orderId,
            productId: productId,
            imageUrl: productImageUrl,
            product: productTitle + ' ' + volume + volumeEntity,
            productNumber: productUnitNumber,
            operation: 'undo',
            userName: userName
        });

        const result = await orderProductTransaction.save();

        const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });

        const wareHouseNotify = new WareHouseNotify({
            orderId: orderId,
            customerId: _order.customerId,
            customer: _order.customer,
            country: _order.country,
            status: orderStatus.ProductNumberChanged,
            number: 6,
            notifyFor: 'dealer'

        });

        await wareHouseNotify.save();



        const unSeenCount1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies1 = await WareHouseNotify.find({ 'status': orderStatus.ProductNumberChanged, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/warehouse').emit('operation', { status: orderStatus.ProductNumberChanged, notifies: notifies1, unSeenCount: unSeenCount1 });


        res.status(201).json({
            statusCode: 201, message: 'Transaction created!',
            orderProduct: _orderProductResult,
            orderProductTransactions: orderProductTransactions
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'undo', 4279, 500, err);

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

        console.log("orderId" + orderId);

        let order = await Order.findById(orderId);

        order.status = orderStatus.OrderCanceled;

        for (const p of order.products) {

            let _product = await Product.findById(ObjectId(p.product._id));

            p.stock = 0;   // this stock variable not shows current stock I am using it when I need it
            _product.stock += p.readyUnit;
            console.log(_product.stock)
            await _product.save();

            p.readyBox = 0;
            p.readyUnit = 0;
            p.status = '';
            p.canceled = false;


        }


        // console.log(order)

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

        const orderProductTransactions = await OrderProductTransaction.find({ orderId: ObjectId(orderId) }).sort({ createdAt: -1 });


        const order1 = await Order.findById(orderId);
        const newOrderOperationNotify = new OrderOperationNotify({
            orderId: orderId,
            customerId: order1.customerId,
            customer: order1.customer,
            country: order1.country,
            status: orderStatus.OrderCanceled,
            number: 12,
            grandTotal: order1.grandTotal,
            currency: order1.currency,
            notifyFor: 'dealer'

        });

        await newOrderOperationNotify.save();

        const wareHouseNotify = new WareHouseNotify({
            orderId: orderId,
            customerId: order1.customerId,
            customer: order1.customer,
            country: order1.country,
            status: orderStatus.OrderCanceled,
            number: 12,
            notifyFor: 'dealer'

        });

        order1.number = 8;
        await order1.save();

        const unSeenCount = await OrderOperationNotify.find({ 'status': orderStatus.OrderCanceled, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies = await OrderOperationNotify.find({ 'status': orderStatus.OrderCanceled, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);

        io.addNamespace('/operations').emit('operation', {});




        await wareHouseNotify.save();

        const unSeenCount1 = await WareHouseNotify.find({ 'status': order.status, isChecked: false, 'notifyFor': 'dealer' }).countDocuments();
        const notifies1 = await WareHouseNotify.find({ 'status': order.status, 'notifyFor': 'dealer' }).sort({ createdAt: -1 }).limit(30);


        io.addNamespace('/warehouse').emit('operation', { status: order.status, notifies: notifies1, unSeenCount: unSeenCount1 });

        const notify = await OrderNotify.find({ 'orderId': orderId }).limit(1).sort({ createdAt: -1 });

        const checkedDate = Date.now;



        await OrderNotify.updateOne({ _id: notify[0]._id }, { status: order.status, userName: userName, isChecked: true });

        io.addNamespace('/orders').emit('updateNotifyDealer', { updateNotify: true });


        res.status(201).json({
            statusCode: 201, message: 'Canceled!',
            orderProduct: _orderProductResult,
            orderResult: _orderResult,
            orderTransactions: orderTransactions,
            orderProductTransactions: orderProductTransactions

        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'orderCanceled', 4405, 500, err);

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
        errorService.sendErrorNotificationViaEmail('orderController', 'postChangeProductStock', 4558, 500, err);

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
        errorService.sendErrorNotificationViaEmail('orderController', 'orderProductStatus', 4616, 500, err);

        next(err);
    }

}



exports.postShipmentDetail = async (req, res, next) => {

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {




        const orderId = ObjectId(req.body.orderId);
        const customerId = ObjectId(req.body.customerId);
        const customerCompany = req.body.customerCompany;
        const customerCountry = req.body.customerCountry;
        const customerAddress = req.body.customerAddress;
        const customerPhone = req.body.customerPhone;
        const customerEmail = req.body.customerEmail;
        const customerFax = req.body.customerFax;
        const customerTaxId = req.body.customerTaxId;
        const deliveryTerms = req.body.deliveryTerms;
        const payments = req.body.payments;
        const creditNumber = req.body.creditNumber;
        const customOffice = req.body.customOffice;
        const manifestPlace = req.body.manifestPlace;
        const sealNo = req.body.sealNo;
        const imoCode = req.body.imoCode;
        const shipNameVoyage = req.body.shipNameVoyage;
        const shipFlag = req.body.shipFlag;
        const entrancePort = req.body.entrancePort;
        const evacuationPort = req.body.evacuationPort;
        const vgmCutOff = req.body.vgmCutOff;
        const manifestCutOff = req.body.manifestCutOff;
        const agency = req.body.agency;
        const truckPlate = req.body.truckPlate;
        const driver = req.body.driver;
        const goodImcoDetail = req.body.goodImcoDetail;
        const gTypeCode = req.body.gTypeCode;
        const description = req.body.description;
        const customCompany = req.body.customCompany;
        const customOfficer = req.body.customOfficer;
        const customPhone = req.body.customPhone;
        const customMobil = req.body.customMobil;
        const customEmail = req.body.customEmail;
        const transporterCompany = req.body.transporterCompany;
        const transporterOfficer = req.body.transporterOfficer;
        const transporterPhone = req.body.transporterPhone;
        const transporterMobil = req.body.transporterMobil;
        const transporterEmail = req.body.transporterEmail;
        const phone = req.body.phone;
        const note = req.body.note;
        const kap = req.body.kap;
        const grandTotal = req.body.grandTotal;
        const totalPrice = req.body.totalPrice;
        const producer1 = req.body.producer1;
        const producer2 = req.body.producer2;
        const producer3 = req.body.producer3;
        const producer4 = req.body.producer4;
        const notify = req.body.notify;
        const hsCode = req.body.hsCode;
        const foreignCurrency = req.body.foreignCurrency;
        const foreignCurrencyPrice = req.body.foreignCurrencyPrice;
        const currencyToLocal = req.body.currencyToLocal;
        const foreignPriceDescription = req.body.foreignPriceDescription;
        const localPriceDescription = req.body.localPriceDescription;
        const invoiceNumber = req.body.invoiceNumber;
        const madeBy = req.body.madeBy;
        const bank = req.body.bank;
        const brunch = req.body.brunch;
        const accountNo = req.body.accountNo;
        const orderProducts = req.body.orderProducts;

        const userName = req.body.userName;
        const userRole = req.body.userRole;

        // console.log("orderId : " + orderId)
        // console.log("deliveryTerms : " + deliveryTerms)
        // console.log("customOffice : " + customOffice)
        // console.log("manifestPlace : " + manifestPlace)
        // console.log("sealNo : " + sealNo)
        // console.log("imoCode : " + imoCode)
        // console.log("shipNameVoyage : " + shipNameVoyage)
        // console.log("shipNameVoyage" + shipFlag)
        // console.log("entrancePort" + entrancePort)
        // console.log("evacuationPort : " + evacuationPort)
        // console.log("vgmCutOff : " + vgmCutOff)
        // console.log("manifestCutOff : " + manifestCutOff)
        // console.log("truckPlate : " + truckPlate)
        // console.log("driver : " + driver)
        // console.log("goodImcoDetail : " + goodImcoDetail)
        // console.log("gTypeCode : " + gTypeCode)
        // console.log("description : " + description)
        // console.log("customCompany :" + customCompany)
        // console.log("customOfficer : " + customOfficer)
        // console.log("customPhone :" + customPhone)
        // console.log("customMobil :" + customMobil)
        // console.log("customEmail :" + customEmail)
        // console.log("transporterCompany :" + transporterCompany)
        // console.log("transporterOfficer :" + transporterOfficer)
        // console.log("transporterPhone :" + transporterPhone)
        // console.log("transporterMobil :" + transporterMobil)
        // console.log("transporterEmail : " + transporterEmail)
        // console.log("madeBy : " + madeBy)
        // console.log("note : " + note)
        // console.log("grandTotal : " + grandTotal)
        // console.log("totalPrice :" + totalPrice)
        // console.log("producer1 : " + producer1)
        // console.log("producer2 : " + producer2)
        // console.log("producer3 : " + producer3)
        // console.log("producer4 : " + producer4)
        // console.log("notify : " + notify)
        // console.log("hsCode : " + hsCode)
        // console.log("foreignCurrency : " + foreignCurrency)
        // console.log("foreignCurrencyPrice : " + foreignCurrencyPrice)
        // console.log("currencyToLocal : " + currencyToLocal)
        // console.log("foreignPriceDescription :" + foreignPriceDescription)
        // console.log("localPriceDescription :" + localPriceDescription)

        // console.log("invoiceNumber : " + invoiceNumber)
        // console.log("bank :" + bank)
        // console.log("madeBy :" + madeBy)
        // console.log("brunch :" + brunch)
        // console.log("accountNo :" + accountNo)





        const products = JSON.parse(orderProducts);
        let productTotalPrices = 0;




        products.forEach(p => {

            const newShippedProduct = new ShippedProduct({
                customer: customerId,
                order: orderId,
                product: p.product._id,
                unit: p.unit,
                unitPrice: p.unitPrice,
                currency: p.currency,
                box: p.box,
                totalPrice: p.totalPrice,
                promotion: p.promotion,
                grossWeight: p.grossWeight,
                emptyBoxWeight: p.emptyBoxWeight
            });
            productTotalPrices += p.totalPrice;

            //  const shippedResult = newShippedProduct.save();



        });


        const newShipmentDetail = new ShipmentDetail({
            order: orderId,
            deliveryTerms: deliveryTerms,
            agency: agency,
            kap: kap,
            payments: payments,
            creditNumber: creditNumber,
            foreignCurrency: foreignCurrency,
            customOffice: customOffice,
            manifestPlace: manifestPlace,
            sealNo: sealNo,
            imoCode: imoCode,
            shipNameVoyage: shipNameVoyage,
            shipFlag: shipFlag,
            entrancePort: entrancePort,
            evacuationPort: evacuationPort,
            vgmCutOff: vgmCutOff,
            manifestCutOff: manifestCutOff,
            truckPlate: truckPlate,
            driver: driver,
            goodImcoDetail: goodImcoDetail,
            gTypeCode: gTypeCode,
            description: description,
            customCompany: customCompany,
            customOfficer: customOfficer,
            customPhone: customPhone,
            customMobil: customMobil,
            customEmail: customEmail,
            transporterCompany: transporterCompany,
            transporterOfficer: transporterOfficer,
            transporterPhone: transporterPhone,
            transporterMobil: transporterMobil,
            transporterEmail: transporterEmail,
            phone: phone,
            note: note,
            totalPrice: productTotalPrices,
            producer1: producer1,
            producer2: producer2,
            producer3: producer3,
            producer4: producer4,
            notify: notify,
            hsCode: hsCode,
            foreignCurrency: foreignCurrency,
            foreignCurrencyPrice: foreignCurrencyPrice,
            currencyToLocal: currencyToLocal,
            foreignPriceDescription: foreignPriceDescription,
            localPriceDescription: localPriceDescription,
            invoiceNumber: invoiceNumber,
            madeBy: madeBy,
            bank: bank,
            brunch: brunch,
            accountNo: accountNo,
            owner: userName
        });

        const customer = new Customer({

            company: customerCompany,
            country: customerCountry,
            address: customerAddress,
            phone: customerPhone,
            email: customerEmail,
            fax: customerFax,
            taxId: customerTaxId

        });

        newShipmentDetail.products.push(products);



        MakeXcel(customerId, customer, newShipmentDetail);



        res.status(201).json({
            statusCode: 201, message: 'Products has been shipped!',

        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'postShipmentDetail', 4691, 500, err);

        next(err);
    }
};

MakeXcel = async (customerId, customer, shipmentDetail) => {


    const xcelTemplate = path.join('data', 'AsilGroupTemplate.xlsx');

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(xcelTemplate);

    // workbook.eachSheet(function (worksheet, sheetId) {

    //     console.log(worksheet.name);
    // });

    let wsCommercial1 = workbook.getWorksheet('Commercial1');
    let wsPackingGeneral = workbook.getWorksheet('Packing General');
    let wsTRFatura = workbook.getWorksheet('TR Fatura');
    let wsIrsaliye = workbook.getWorksheet('İrsaliye');
    let wsTalimat = workbook.getWorksheet('Talimat');





    makeCommercial1Report(customerId, customer, wsCommercial1, shipmentDetail);

    // makePackingGeneralReport(customerId, customer, wsPackingGeneral, shipmentDetail);

    // makeTRFaturaReport(customerId, customer, wsTRFatura, shipmentDetail);

    // makeIrsaliyeReport(customerId, customer, wsIrsaliye, shipmentDetail);

    // makeTalimatReport(customerId, customer, wsTalimat, shipmentDetail);

    try {

        newXcelFilename = Date.now() + '.xlsx';
        const newXcelFile = path.join('data', 'xcel', newXcelFilename);

        await workbook.xlsx.writeFile(newXcelFile);


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getShipmentDetail = async (req, res, next) => {
    const orderId = req.params.orderId


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        const shipmentDetail = await ShipmentDetail
            .find({ order: orderId })
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ orderDate: -1 });



        res.status(200).json({
            message: 'Fetched shipment detail succesfully',
            shipmentDetail: shipmentDetail[0],

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'getShipmentDetail', 4993, 500, err);

        next(err);
    }

}


makeCommercial1Report = async (customerId, customer, wsCommercial1, shipmentDetail) => {

    wsCommercial1.getCell(13, 3).value = "Company : " + customer.company;
    wsCommercial1.getCell(14, 3).value = "Address : " + customer.address;
    wsCommercial1.getCell(15, 3).value = "Country : " + customer.country;
    wsCommercial1.getCell(16, 3).value = "Phone : " + customer.phone;
    wsCommercial1.getCell(17, 3).value = "Fax : " + customer.fax;
    wsCommercial1.getCell(18, 3).value = "Tax Id : " + customer.taxId;




    let _now = new Date();

    wsCommercial1.getCell(12, 11).value = shipmentDetail.invoiceNumber;
    wsCommercial1.getCell(14, 11).value = _now.getMonth() + " / " + _now.getDay() + " / " + _now.getFullYear();
    wsCommercial1.getCell(15, 11).value = shipmentDetail.deliveryTerms;
    wsCommercial1.getCell(16, 11).value = shipmentDetail.payments;
    wsCommercial1.getCell(18, 11).value = shipmentDetail.creditNumber;


    orginRow = 26;
    let row = orginRow;

    // totalBoxes = 0;
    // totalPieces = 0;
    // grandTotal = 0;
    // totalNetWeight = 0;
    // totalGrossWeight = 0;
    // totalM3 = 0;

    promotionHeader = false;

    shipmentDetail.products[0].forEach(p => {



        if (p.promotion === true) {

            if (promotionHeader === false) {
                wsCommercial1.insertRow(row, []);

                // wsCommercial1.unMergeCells('A' + row);


                //      wsCommercial1.mergeCells('C' + row + ':' + 'L' + row);


                wsCommercial1.getCell(row, 3).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };

                wsCommercial1.getCell(row, 4).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };
                wsCommercial1.getCell(row, 5).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };

                wsCommercial1.getCell(row, 6).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };
                wsCommercial1.getCell(row, 7).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };
                wsCommercial1.getCell(row, 9).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };
                wsCommercial1.getCell(row, 10).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };
                wsCommercial1.getCell(row, 11).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };
                wsCommercial1.getCell(row, 12).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E5E5E5' }
                };

                wsCommercial1.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'thin' } };
                wsCommercial1.getCell(row, 3).value = 'FREE OF CHARGE ONLY FOR CUSTOM PURPOSES';
                wsCommercial1.getCell(row, 3).alignment = { horizontal: 'center', vertical: 'middle' };
                wsCommercial1.getCell(row, 3).font = { 'bold': true, 'size': 12 };
                wsCommercial1.getCell(row, 3).border = { left: { style: 'medium' }, top: { style: 'thin' } };
                wsCommercial1.getCell(row, 4).border = { top: { style: 'thin' } };
                wsCommercial1.getCell(row, 5).border = { top: { style: 'thin' } };


                wsCommercial1.getCell(row, 6).border = { top: { style: 'thin' } };
                wsCommercial1.getCell(row, 7).border = { right: { style: 'thin' }, top: { style: 'thin' } };
                wsCommercial1.getCell(row, 8).border = { right: { style: 'thin' } };
                wsCommercial1.getCell(row, 9).border = { top: { style: 'thin' } };
                wsCommercial1.getCell(row, 10).border = { top: { style: 'thin' } };
                wsCommercial1.getCell(row, 11).border = { top: { style: 'thin' } };

                wsCommercial1.getCell(row, 12).border = { right: { style: 'medium' }, top: { style: 'thin' } };


                row++;
                promotionHeader = true;

            }

        }


        totalBoxes += Number(p.readyBox);
        totalPieces += Number(p.readyUnit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.grossWeight);
        totalGrossWeight += Number(p.grossWeight) + (Number(p.product.emptyBoxWeight) * Number(p.readyBox));
        // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
        totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight) * p.readyBox);

        var rowValues = [];
        rowValues[3] = p.title;

        let vEntity = p.volumeEntity;

        if (p.volumeEntity === 'Not') {

            vEntity = '';

        }

        console.log(vEntity)


        rowValues[6] = p.volume + " " + vEntity;
        rowValues[7] = p.quantityInBox;

        rowValues[9] = p.readyBox;
        rowValues[10] = p.readyUnit;
        rowValues[11] = p.unitPrice + " " + p.currency;
        rowValues[12] = p.totalPrice + " " + p.currency;



        wsCommercial1.insertRow(row, rowValues);



        wsCommercial1.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'thin' } };
        wsCommercial1.getCell(row, 3).alignment = { vertical: 'middle' };
        wsCommercial1.getCell(row, 3).border = { left: { style: 'medium' }, top: { style: 'thin' } };
        wsCommercial1.getCell(row, 6).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 6).border = { top: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' } };
        wsCommercial1.getCell(row, 7).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 7).border = { top: { style: 'thin' }, right: { style: 'thin' } };
        wsCommercial1.getCell(row, 9).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 9).border = { top: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' } };
        wsCommercial1.getCell(row, 10).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 10).border = { top: { style: 'thin' }, right: { style: 'thin' } };
        wsCommercial1.getCell(row, 11).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 11).border = { top: { style: 'thin' }, right: { style: 'medium' } };
        wsCommercial1.getCell(row, 12).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 12).border = { top: { style: 'medium' }, right: { style: 'medium' } };



        row++;

    });


    wsCommercial1.spliceRows(row, 1);


    wsCommercial1.getCell(row, 8).value = shipmentDetail.kap + ' kap';
    wsCommercial1.getCell(row, 9).value = totalBoxes;
    wsCommercial1.getCell(row, 10).value = totalPieces;
    wsCommercial1.getCell(row, 12).value = grandTotal + ' ' + shipmentDetail.foreignCurrency;
    wsCommercial1.getCell(row + 3, 12).value = grandTotal + ' ' + shipmentDetail.foreignCurrency;
    wsCommercial1.getCell(row, 12).font = { 'bold': true };

    let row1 = Number(row) + Number(1);
    let row2 = Number(row) + Number(2);
    let row3 = Number(row) + Number(3);
    let row4 = Number(row) + Number(4);
    let row5 = Number(row) + Number(5);
    let row6 = Number(row) + Number(6);

    let row10 = Number(row) + Number(10);
    let row11 = Number(row) + Number(11);
    let row12 = Number(row) + Number(12);
    let row13 = Number(row) + Number(13);
    let row14 = Number(row) + Number(14);




    // wsCommercial1.unMergeCells('C' + 27);
    // wsCommercial1.unMergeCells('G' + 37);
    wsCommercial1._merges = {};


    wsCommercial1.mergeCells('C' + row + ':' + 'G' + row);
    wsCommercial1.getCell(row, 3).border = { right: { style: 'medium' }, top: { style: 'thin' }, left: { style: 'medium' } };

    wsCommercial1.getCell(row, 9).border = { right: { style: 'thin', color: { argb: 'FFFFFF' } }, top: { style: 'thin' }, left: { style: 'medium' } };



    wsCommercial1.mergeCells('H' + row1 + ':' + 'K' + row1);
    wsCommercial1.getCell(row1, 11).border = { right: { style: 'medium' }, top: { style: 'medium' }, left: { style: 'medium' } };


    wsCommercial1.mergeCells('H' + row2 + ':' + 'K' + row2);
    wsCommercial1.getCell(row2, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };


    wsCommercial1.mergeCells('H' + row3 + ':' + 'K' + row3);
    wsCommercial1.getCell(row3, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };



    wsCommercial1.mergeCells('H' + row4 + ':' + 'K' + row4);
    wsCommercial1.getCell(row4, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };

    wsCommercial1.unMergeCells('H' + row5);
    wsCommercial1.mergeCells('H' + row5 + ':' + 'K' + row5);
    wsCommercial1.getCell(row5, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };





    wsCommercial1.mergeCells('H' + row6 + ':' + 'K' + row6);
    wsCommercial1.getCell(row6, 11).border = { right: { style: 'medium' }, top: { style: 'medium' }, bottom: { style: 'medium' } };

    wsCommercial1.unMergeCells('G' + row10);
    wsCommercial1.mergeCells('G' + row10 + ':' + 'I' + row10);
    wsCommercial1.getCell(row10, 7).border = { right: { style: 'medium' }, top: { style: 'medium' } };

    wsCommercial1.unMergeCells('G' + row11);
    wsCommercial1.mergeCells('G' + row11 + ':' + 'I' + row11);
    wsCommercial1.getCell(row11, 7).border = { right: { style: 'medium' }, top: { style: 'thin' } };

    wsCommercial1.unMergeCells('G' + row12);
    wsCommercial1.mergeCells('G' + row12 + ':' + 'I' + row12);
    wsCommercial1.getCell(row12, 7).border = { right: { style: 'medium' }, top: { style: 'thin' } };

    wsCommercial1.unMergeCells('G' + row13);
    wsCommercial1.mergeCells('G' + row13 + ':' + 'I' + row13);
    wsCommercial1.getCell(row13, 7).border = { right: { style: 'medium' }, top: { style: 'thin' } };

    wsCommercial1.unMergeCells('G' + row14);
    wsCommercial1.mergeCells('G' + row14 + ':' + 'I' + row14);
    wsCommercial1.getCell(row14, 7).border = { right: { style: 'medium' }, bottom: { style: 'medium' }, top: { style: 'thin' } };



    wsCommercial1.getCell('G' + row10).value = totalGrossWeight;
    wsCommercial1.getCell('G' + row11).value = totalNetWeight;
    wsCommercial1.getCell('G' + row12).value = totalBoxes;
    wsCommercial1.getCell('G' + row13).value = shipmentDetail.kap + ' kap';
    wsCommercial1.getCell('G' + row14).value = totalM3;

    // wsCommercial1.getCell(row,2).border={left: {style:'medium'},top:{ style:'thin'} };
    // wsCommercial1.getCell(row,3).border={left: {style:'none'},top:{ style:'thin'} };
    // wsCommercial1.getCell(row,6).border={top: {style:'thin'},right: {style:'thin'},left: {style:'thin'} };
    // wsCommercial1.getCell(row,7).border={top: {style:'thin'},right: {style:'thin'} };
    // wsCommercial1.getCell(row,9).border={top: {style:'thin'},right: {style:'thin'},left: {style:'thin'} };
    // wsCommercial1.getCell(row,10).border={top: {style:'thin'},right: {style:'thin'} };
    // wsCommercial1.getCell(row,11).border={top: {style:'thin'},right: {style:'medium'} };
    // wsCommercial1.getCell(row,12).border={top: {style:'medium'},right: {style:'medium'} };


}

makePackingGeneralReport = async (customerId, customer, workSheet, shipmentDetail) => {

    workSheet.getCell(17, 2).value = "Company : " + customer.company;
    workSheet.getCell(18, 2).value = "Address : " + customer.address;
    workSheet.getCell(19, 2).value = "Country : " + customer.country;
    workSheet.getCell(20, 2).value = "Phone : " + customer.phone;
    workSheet.getCell(21, 2).value = "Fax : " + customer.fax;
    workSheet.getCell(22, 2).value = "Tax Id : " + customer.taxId;


    workSheet.getCell(28, 2).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, left: { style: 'medium' }, right: { style: 'thin' } };
    workSheet.getCell(28, 3).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 4).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 5).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 6).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 7).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 8).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 9).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 10).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 11).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 12).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 13).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 14).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 15).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 16).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 17).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'medium' } };

    let _now = new Date();

    workSheet.getCell(17, 16).value = shipmentDetail.invoiceNumber;
    workSheet.getCell(16, 16).value = _now.getMonth() + " / " + _now.getDay() + " / " + _now.getFullYear();



    orginRow = 29;
    let row = orginRow;



    promotionHeader = false;

    shipmentDetail.products[0].forEach(p => {



        if (p.promotion === true) {

            if (promotionHeader === false) {
                workSheet.insertRow(row, []);

                workSheet.getRow(row).height = 20;

                workSheet.getCell(row, 2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 12).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 13).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 14).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 15).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
                workSheet.getCell(row, 16).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };


                workSheet.getCell(row, 2).value = 'FREE OF CHARGE ONLY FOR CUSTOM PURPOSES';
                workSheet.getCell(row, 2).alignment = { horizontal: 'center', vertical: 'middle' };
                workSheet.getCell(row, 2).font = { 'bold': true, 'size': 12 };
                workSheet.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'thin' }, bottom: { style: 'thin' } };
                workSheet.getCell(row, 4).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
                workSheet.getCell(row, 5).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };




                workSheet.getCell(row, 9).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };

                workSheet.getCell(row, 11).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };

                workSheet.getCell(row, 12).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
                workSheet.getCell(row, 13).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
                workSheet.getCell(row, 14).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
                workSheet.getCell(row, 15).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
                workSheet.getCell(row, 16).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
                workSheet.getCell(row, 17).border = { right: { style: 'medium' } };
                row++;
                promotionHeader = true;

            }

        }


        totalBoxes += Number(p.box);
        totalPieces += Number(p.unit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.grossWeight);
        totalGrossWeight += totalNetWeight + (Number(p.product.emptyBoxWeight) / 1000);
        // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
        totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight));

        var rowValues = [];
        rowValues[2] = p.title;

        let vEntity = p.volumeEntity;

        if (p.volumeEntity === 'Not') {

            vEntity = '';

        }



        rowValues[5] = p.volume + " " + vEntity;
        rowValues[6] = p.boxWidth;
        rowValues[7] = p.boxLength;
        rowValues[8] = p.boxHeight;

        rowValues[9] = p.box;
        //rowValues[10] = p.unit;

        rowValues[11] = p.readyProductBoxNumber;
        rowValues[12] = p.unit;

        rowValues[14] = p.grossWeight + ((p.emptyBoxWeight / 1000) * p.readyProductBoxNumber);
        rowValues[15] = p.emptyBoxWeight;
        rowValues[16] = p.grossWeight;



        workSheet.getRow(row).height = 20;
        workSheet.insertRow(row, rowValues);
        workSheet.getCell(row, 2).border = { left: { style: 'medium' }, };
        workSheet.getCell(row, 2).alignment = { vertical: 'middle' };
        workSheet.getCell(row, 3).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 3).alignment = { vertical: 'middle' };
        workSheet.getCell(row, 4).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 4).alignment = { vertical: 'middle' };
        workSheet.getCell(row, 5).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 5).alignment = { vertical: 'middle', horizontal: 'center' };
        workSheet.getCell(row, 6).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 6).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 7).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 7).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 8).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 8).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 9).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 9).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 10).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 10).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 11).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 11).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 12).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 12).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 13).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 13).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 14).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 14).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 15).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 15).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 16).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 16).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 17).border = { left: { style: 'thin' }, right: { style: 'medium' } };
        workSheet.getCell(row, 17).alignment = { vertical: 'middle', horizontal: 'center' };
        row++;

    });




    workSheet.getCell(18, 17).value = shipmentDetail.deliveryTerms;
    workSheet.getCell(19, 17).value = totalGrossWeight;
    workSheet.getCell(20, 17).value = totalNetWeight;
    workSheet.getCell(21, 17).value = totalBoxes;
    workSheet.getCell(22, 17).value = totalM3;

    workSheet.spliceRows(row, 1);
    workSheet.spliceRows(row, 1);




    workSheet.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 2).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 3).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 3).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 4).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 4).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 5).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 5).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 6).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 6).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 7).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 7).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 8).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 8).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 9).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 9).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 10).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 10).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 11).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 11).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 12).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 12).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 13).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 13).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 14).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 14).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 15).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 15).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 16).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 16).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 17).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    workSheet.getCell(row, 17).alignment = { vertical: 'middle', horizontal: 'center' };

    workSheet.getCell(row, 17).value = totalM3;
    workSheet.getCell(row, 17).font = { 'bold': true };
    workSheet.getCell(row, 16).value = totalNetWeight;
    workSheet.getCell(row, 16).font = { 'bold': true };
    workSheet.getCell(row, 14).value = totalGrossWeight;
    workSheet.getCell(row, 14).font = { 'bold': true };
    workSheet.getCell(row, 12).value = totalPieces;
    workSheet.getCell(row, 12).font = { 'bold': true };
    workSheet.getCell(row, 11).value = totalBoxes;
    workSheet.getCell(row, 11).font = { 'bold': true };
    workSheet.getCell(row, 10).value = shipmentDetail.kap;
    workSheet.getCell(row, 10).font = { 'bold': true };




}

makeTRFaturaReport = async (customerId, customer, workSheet, shipmentDetail) => {

    workSheet.getCell(1, 2).value = "Company : " + customer.company;
    workSheet.getCell(2, 2).value = "Address : " + customer.address;
    workSheet.getCell(3, 2).value = "Country : " + customer.country;
    workSheet.getCell(4, 2).value = "Phone : " + customer.phone;
    workSheet.getCell(5, 2).value = "Fax : " + customer.fax;
    workSheet.getCell(6, 2).value = "Tax Id : " + customer.taxId;



    let _now = new Date();


    workSheet.getCell(5, 7).value = _now.getMonth() + " / " + _now.getDay() + " / " + _now.getFullYear();
    workSheet.getCell(6, 7).value = 'Düzenleme Saati : ' + _now.getHours() + " : " + _now.getMinutes();



    orginRow = 13;
    let row = orginRow;

    // totalBoxes = 0;
    // totalPieces = 0;
    // grandTotal = 0;
    // totalNetWeight = 0;
    // totalGrossWeight = 0;
    // totalM3 = 0;


    workSheet.getRow(row).height = 20;

    shipmentDetail.products[0].forEach(p => {

        var rowValues = [];
        rowValues[2] = p.title;

        let vEntity = p.volumeEntity;

        if (p.volumeEntity === 'Not') {

            vEntity = '';

        }



        rowValues[3] = p.volume + vEntity;
        rowValues[4] = p.unit;
        rowValues[5] = 'ADET';;
        rowValues[6] = p.unitPrice + " " + p.currency;
        rowValues[7] = p.totalPrice + " " + p.currency;


        if (p.promotion === true) {

            workSheet.insertRow(row, rowValues);

            workSheet.getCell(row, 2).value = p.title + ' Bedelsiz';


            row++;
        }
        else {
            workSheet.insertRow(row, rowValues);
            row++;

        }

        totalBoxes += Number(p.box);
        totalPieces += Number(p.unit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.grossWeight);
        totalGrossWeight += totalNetWeight + (Number(p.product.emptyBoxWeight) / 1000);
        //totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
        totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight));

    });

    // console.log(shipmentDetail)

    row = row + 2;

    workSheet.getCell(row, 2).value = 'Meşei : ' + shipmentDetail.madeBy;
    row++;
    workSheet.getCell(row, 2).value = 'Teslim Şekli : ' + shipmentDetail.deliveryTerms;
    row++;
    workSheet.getCell(row, 2).value = 'Ödeme Şekli : ' + shipmentDetail.payments;
    row++;
    workSheet.getCell(row, 2).value = 'Bank : ' + shipmentDetail.bank;
    row++;
    workSheet.getCell(row, 2).value = 'Şube : ' + shipmentDetail.brunch;
    row++;
    workSheet.getCell(row, 2).value = 'Hesap No : ' + shipmentDetail.accountNo;

    row = row + 2;

    workSheet.getCell(row, 2).value = 'Toplam Kap : ' + shipmentDetail.kap + ' kap';
    row++;
    workSheet.getCell(row, 2).value = 'Toplam Metreküp : ' + totalM3;
    row++;
    workSheet.getCell(row, 2).value = 'Net KGS : ' + totalNetWeight;
    row++;
    workSheet.getCell(row, 2).value = 'Brüt KGS : ' + totalGrossWeight;
    row = row + 2;
    workSheet.getCell(row, 2).value = shipmentDetail.foreignCurrency + ' : ' + shipmentDetail.foreignCurrencyPrice;
    row = row + 2;
    workSheet.getCell(row, 2).value = 'TL Toplam Tutar : ' + shipmentDetail.currencyToLocal;
    row = row + 2;
    workSheet.getCell(row, 2).value = 'YALNIZ : ' + shipmentDetail.localPriceDescription;
    row = row + 2;
    workSheet.getCell(row, 6).value = shipmentDetail.foreignCurrency + ' ' + grandTotal;




    // workSheet.spliceRows(row, 1);
    // workSheet.spliceRows(row, 1);








}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

makeIrsaliyeReport = async (customerId, customer, workSheet, shipmentDetail) => {

    workSheet.getCell(5, 2).value = "Company : " + customer.company;
    workSheet.getCell(6, 2).value = "Address : " + customer.address;
    workSheet.getCell(7, 2).value = "Country : " + customer.country;

    let _now = new Date();

    workSheet.getCell(7, 6).value = _now.getMonth() + " / " + _now.getDay() + " / " + _now.getFullYear();

    orginRow = 13;
    let row = orginRow;

    totalBoxes = 0;
    totalPieces = 0;
    grandTotal = 0;
    totalNetWeight = 0;
    totalGrossWeight = 0;
    totalM3 = 0;


    workSheet.getRow(row).height = 20;

    productCategories = [];

    shipmentDetail.products[0].forEach(p => {



        var rowValues = [];
        rowValues[2] = p.unit;
        rowValues[3] = 'ADET';
        rowValues[5] = p.title;


        let vEntity = p.volumeEntity;

        if (p.volumeEntity === 'Not') {

            vEntity = '';

        }


        rowValues[6] = p.volume + vEntity;



        if (p.promotion === true) {

            workSheet.insertRow(row, rowValues);

            workSheet.getCell(row, 5).value = p.title + ' Bedelsiz';


            let b = p.product.categoryNameLower + '(Bedelsiz)';

            productCategories.push(b);



            row++;
        }
        else {
            workSheet.insertRow(row, rowValues);

            console.log(p.product)

            productCategories.push(p.product.categoryNameLower);
            row++;

        }

        totalBoxes += Number(p.box);
        totalPieces += Number(p.unit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.grossWeight);
        totalGrossWeight += totalNetWeight + (Number(p.product.emptyBoxWeight) / 1000);
        // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
        totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight));

    });



    row = row + 2;
    rightRow = row;

    workSheet.getCell(row, 2).value = 'Menşei : ' + shipmentDetail.madeBy;
    row++;
    workSheet.getCell(row, 2).value = 'Teslim Şekli : ' + shipmentDetail.deliveryTerms;
    row++;
    workSheet.getCell(row, 2).value = 'Ödeme Şekli : ' + shipmentDetail.payments;
    row++;
    workSheet.getCell(row, 2).value = 'Bank : ' + shipmentDetail.bank;
    row++;
    workSheet.getCell(row, 2).value = 'Şube : ' + shipmentDetail.brunch;
    row++;
    workSheet.getCell(row, 2).value = 'Hesap No : ' + shipmentDetail.accountNo;


    workSheet.getCell(rightRow, 5).value = 'Toplam Kap : ' + shipmentDetail.kap + ' kap';
    rightRow++;
    workSheet.getCell(rightRow, 5).value = 'Toplam Metreküp : ' + totalM3;
    rightRow++;
    workSheet.getCell(rightRow, 5).value = 'Net KGS : ' + totalNetWeight;
    rightRow++;
    workSheet.getCell(rightRow, 5).value = 'Brüt KGS : ' + totalGrossWeight;




}

makeTalimatReport = async (customerId, customer, workSheet, shipmentDetail) => {

    let _now = new Date();
    workSheet.getCell(4, 4).value = _now.getMonth() + " / " + _now.getDay() + " / " + _now.getFullYear();

    workSheet.getCell(15, 2).value = 'Company : ' + customer.company;
    workSheet.getCell(16, 2).value = 'Address : ' + customer.address;
    workSheet.getCell(17, 2).value = 'Country : ' + customer.country;
    workSheet.getCell(18, 2).value = 'Phone : ' + customer.phone;
    if (customer.fax != '') {
        workSheet.getCell(19, 2).value = 'Fax : ' + customer.fax;
    }
    if (customer.taxId != '') {
        workSheet.getCell(20, 2).value = 'Vat : ' + customer.taxId;
    }

    workSheet.getCell(6, 6).value = 'Company : ' + customer.company;
    workSheet.getCell(7, 6).value = 'Address : ' + customer.address;
    workSheet.getCell(8, 6).value = 'Country : ' + customer.country;
    workSheet.getCell(9, 6).value = 'Phone : ' + customer.phone;
    if (customer.fax != '') {
        workSheet.getCell(10, 6).value = 'Fax : ' + customer.fax;
    }
    if (customer.taxId != '') {
        workSheet.getCell(11, 6).value = 'Vat : ' + customer.taxId;
    }


    workSheet.getCell(23, 2).value = shipmentDetail.customCompany;
    workSheet.getCell(24, 2).value = shipmentDetail.customOfficer;
    workSheet.getCell(25, 2).value = shipmentDetail.customPhone;
    workSheet.getCell(26, 2).value = shipmentDetail.customEmail;


    workSheet.getCell(23, 7).value = shipmentDetail.transporterCompany;
    workSheet.getCell(24, 7).value = shipmentDetail.transporterOfficer;
    workSheet.getCell(25, 7).value = shipmentDetail.transporterPhone;
    workSheet.getCell(27, 7).value = shipmentDetail.transporterEmail;

    let productTypes = '';



    for (let value of productCategories.filter(onlyUnique)) {

        productTypes += value + ',';

    }

    workSheet.getCell(29, 2).value = productTypes.substring(0, productTypes.length - 1);
    workSheet.getCell(30, 2).value = shipmentDetail.hsCode;
    workSheet.getCell(31, 2).value = shipmentDetail.kap;
    workSheet.getCell(32, 2).value = totalGrossWeight;
    workSheet.getCell(33, 2).value = totalNetWeight;
    workSheet.getCell(34, 2).value = totalM3;
    workSheet.getCell(37, 1).value = 'Malın Menşei : ' + shipmentDetail.madeBy;



    workSheet.getCell(29, 7).value = shipmentDetail.bank + ',' + shipmentDetail.brunch;
    workSheet.getCell(30, 7).value = shipmentDetail.payments;
    workSheet.getCell(31, 7).value = shipmentDetail.deliveryTerms;
    workSheet.getCell(32, 7).value = customer.country;
    workSheet.getCell(33, 7).value = shipmentDetail.producer1;
    workSheet.getCell(34, 7).value = shipmentDetail.producer2;
    workSheet.getCell(35, 7).value = shipmentDetail.producer3;
    workSheet.getCell(36, 7).value = shipmentDetail.producer4;

    workSheet.getCell(39, 4).value = shipmentDetail.customOffice;
    workSheet.getCell(40, 4).value = shipmentDetail.manifestPlace;
    workSheet.getCell(41, 4).value = shipmentDetail.sealNo;
    workSheet.getCell(42, 4).value = shipmentDetail.imoCode;
    workSheet.getCell(43, 4).value = shipmentDetail.shipNameVoyage;
    workSheet.getCell(44, 4).value = shipmentDetail.shipFlag;
    workSheet.getCell(45, 4).value = shipmentDetail.entrancePort;
    workSheet.getCell(46, 4).value = shipmentDetail.evacuationPort;
    workSheet.getCell(47, 4).value = shipmentDetail.vgmCutOff;
    workSheet.getCell(48, 4).value = shipmentDetail.manifestCutOff;
    workSheet.getCell(49, 4).value = shipmentDetail.agency;
    workSheet.getCell(50, 4).value = shipmentDetail.driver;
    workSheet.getCell(50, 5).value = shipmentDetail.truckPlate;
    workSheet.getCell(51, 4).value = shipmentDetail.goodImcoDetail;
    workSheet.getCell(52, 4).value = shipmentDetail.gTypeCode;

    workSheet.getCell(56, 1).value = shipmentDetail.description;

}


sendPdf = async (customerEmail, _orderId) => {

    const orderId = _orderId;

    const order = await Order
        .findById(orderId);

    const customerId = order.customerId;

    const invoiceName = 'order-' + order.id + '.pdf';
    const invoicePath = path.join('images', 'orderPDF', invoiceName);



    try {


        const pdfDoc = new PDFDocument({ autoFirstPage: false });

        pdfDoc.addPage({ margin: 10 });
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        let _now = new Date();

        pdfDoc.fontSize(8).text('+90 212 552 00 39', 10, 10);
        pdfDoc.fontSize(8).text('info@asilgroup.com.tr', 200, 10);
        pdfDoc.fontSize(8).text('www.nishman.com.tr', 10, 10, { align: 'right' });
        pdfDoc.save().moveTo(10, 30).lineTo(600, 30).stroke(); //top
        pdfDoc.save().moveTo(10, 30).lineTo(10, 60).stroke(); //left
        pdfDoc.save().moveTo(10, 60).lineTo(600, 60).stroke(); //bottom
        pdfDoc.save().moveTo(600, 30).lineTo(600, 60).stroke(); //

        pdfDoc.save().moveTo(425, 30).lineTo(425, 60).stroke(); //
        pdfDoc.fontSize(15).font('Helvetica-Bold').text('ASiL GROUP iC ve DIS TiC. SAN. LTD. STi.', 20, 40);
        pdfDoc.fontSize(15).text('Date : ' + _now.getMonth() + " / " + _now.getDay() + " / " + _now.getFullYear(), 440, 40);
        pdfDoc.save().moveTo(10, 85).lineTo(600, 85).stroke(); //bottom
        pdfDoc.save().moveTo(10, 60).lineTo(10, 85).stroke(); //left
        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Description of Goods', 20, 70);
        pdfDoc.save().moveTo(300, 60).lineTo(300, 85).stroke(); //
        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Volume', 305, 70);
        pdfDoc.save().moveTo(345, 60).lineTo(345, 85).stroke(); //right
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Pcs', 353, 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('in Box', 350, 75);
        pdfDoc.save().moveTo(380, 60).lineTo(380, 85).stroke(); //right
        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Boxes', 387, 70);
        pdfDoc.save().moveTo(425, 60).lineTo(425, 85).stroke(); //right
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Unit', 444, 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Price', 442, 75);
        pdfDoc.save().moveTo(480, 60).lineTo(480, 85).stroke(); //right

        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Total Price', 515, 70);

        pdfDoc.save().moveTo(600, 60).lineTo(600, 85).stroke(); //

        const products = order.products;

        let grandTotal = 0;
        x = 92;
        y = 85;
        line = 0;
        page = 1;
        limitOfLine = 34;



        products.forEach(prod => {


            if (page != 1) {
                limitOfLine = 37;

            }

            if (line == limitOfLine) {
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);
                pdfDoc.addPage({ margin: 10 });
                page++;
                x = 37;
                y = 30;
                line = 0;
                pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //top

                let _totalPrice = 0;

                _totalPrice = Number(prod.readyBox) * Number(prod.product.quantityInBox) * Number(prod.unitPrice);


                grandTotal += _totalPrice;

                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left
                if (prod.product.title.length > 49) {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.title.substring(0, 48), 20, x);
                } else {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.title, 20, x);
                }



                pdfDoc.save().moveTo(300, y).lineTo(300, y + 20).stroke(); //right

                if (prod.product.volumeEntity != 'Not') {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.volume + " " + prod.product.volumeEntity, 305, x);
                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length > 7) {
                    pdfDoc.fontSize(6).font('Helvetica').text(prod.product.volume, 305, x);

                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length <= 8) {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.volume, 305, x);
                }

                pdfDoc.save().moveTo(345, y).lineTo(345, y + 20).stroke(); //right

                pdfDoc.fontSize(9).font('Helvetica').text(prod.product.quantityInBox, 355, x);
                pdfDoc.save().moveTo(380, y).lineTo(380, y + 20).stroke(); //right


                pdfDoc.fontSize(9).font('Helvetica').text(prod.readyBox, 392, x);
                pdfDoc.save().moveTo(425, y).lineTo(425, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.unitPrice + " " + prod.currency, 438, x);
                pdfDoc.save().moveTo(480, y).lineTo(480, y + 20).stroke(); //right

                pdfDoc.fontSize(10).font('Helvetica').text(_totalPrice.toFixed(2) + " " + prod.currency, 515, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom

                x += 20
                y += 20
                line++;


            } else {
                let _totalPrice = 0;

                _totalPrice = Number(prod.readyBox) * Number(prod.product.quantityInBox) * Number(prod.unitPrice);


                grandTotal += _totalPrice;

                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left
                if (prod.product.title.length > 49) {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.title.substring(0, 48), 20, x);
                } else {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.title, 20, x);
                }



                pdfDoc.save().moveTo(300, y).lineTo(300, y + 20).stroke(); //right

                if (prod.product.volumeEntity != 'Not') {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.volume + " " + prod.product.volumeEntity, 305, x);
                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length > 7) {
                    pdfDoc.fontSize(6).font('Helvetica').text(prod.product.volume, 305, x);

                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length <= 8) {
                    pdfDoc.fontSize(9).font('Helvetica').text(prod.product.volume, 305, x);
                }

                pdfDoc.save().moveTo(345, y).lineTo(345, y + 20).stroke(); //right

                pdfDoc.fontSize(9).font('Helvetica').text(prod.product.quantityInBox, 355, x);
                pdfDoc.save().moveTo(380, y).lineTo(380, y + 20).stroke(); //right


                pdfDoc.fontSize(9).font('Helvetica').text(prod.readyBox, 392, x);
                pdfDoc.save().moveTo(425, y).lineTo(425, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.unitPrice + " " + prod.currency, 438, x);
                pdfDoc.save().moveTo(480, y).lineTo(480, y + 20).stroke(); //right

                pdfDoc.fontSize(10).font('Helvetica').text(_totalPrice.toFixed(2) + " " + prod.currency, 515, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom

                x += 20
                y += 20
                line++;

            }


        });


        pdfDoc.save().moveTo(380, y).lineTo(380, y + 20).stroke(); //right
        pdfDoc.fontSize(10).font('Helvetica-Bold').text("Grand Total ", 400, x);
        pdfDoc.save().moveTo(480, y).lineTo(480, y + 20).stroke(); //right
        pdfDoc.fontSize(10).font('Helvetica').text(grandTotal.toFixed(2) + " " + order.currency, 515, x);
        pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
        pdfDoc.save().moveTo(380, y + 20).lineTo(600, y + 20).stroke(); //bottom
        pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);

        pdfDoc.end();

        const pdf = new DealerPdf({
            customerId: customerId,
            orderId: order.id
        });

        const pdfFile = await DealerPdf.find({ customerId: customerId.toString(), orderId: order.id.toString() });

        if (pdfFile.length == 0) {
            const result = await pdf.save();
        }





        // const to = req.body.to;
        // const subject = req.body.subject;
        // const text = req.body.text;
        // const filename = req.body.filename;
        // const path = req.body.path;
        // const owner = req.body.owner;

        const to = customerEmail;
        const subject = "Your Order has been Approved!!!";
        const text = "Your Order has been approved and your proformo is attached on this e-mail please check attachments"


        Email.find({ owner: order.owner })
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

                const mailOptions = {
                    from: emailSetting[0].userName,
                    to: to,
                    subject: subject,
                    text: text,
                    attachments: [{
                        filename: invoiceName,
                        path: invoicePath
                    }]
                };
                let information;

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        information = error;
                        errorService.sendErrorNotificationViaEmail('orderController', 'sendPdf', 5896, 500, error);

                    } else {
                        information = info.response;
                        console.log('email sent : ' + information);
                    }
                });



            });



        // console.log(invoiceName)


    } catch (err) {
        errorService.sendErrorNotificationViaEmail('orderController', 'sendPdf', 6180, 500, err);

        console.log(err);
    }










    //         res.status(200).json({ information: information })


    //     }).catch(err => {
    //         if (!err.statusCode) {

    //             err.message = " Check the owner this mail"

    //         }
    //         next(err);

    //     });


}

exports.assignAddressToCustomer = async (req, res, next) => {
    const orderId = req.params.orderId;
    const whatfor = req.params.whatfor;

    try {

        const order = await Order.findById(orderId);

        if (!order) {
            const error = new Error('Could not find order.');
            error.statusCode = 404;
            throw error;
        }

        if (whatfor === 'billing') {
            order.billingAddress = req.body;
        }
        if (whatfor === 'deliver') {
            order.deliveryAddress = req.body;
        }
        if (whatfor === 'both') {
            order.billingAddress = req.body;
            order.deliveryAddress = req.body;
        }


        const result = await order.save();



        res.status(200).json({ message: 'Custom updated!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('orderController', 'assignAddressToCustomer', 6211, 500, err);

        next(err);
    }
};