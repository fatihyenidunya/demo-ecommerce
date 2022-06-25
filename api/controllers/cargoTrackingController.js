const mongodb = require('mongodb');
const CargoTracking = require('../models/cargoTracking');
const { validationResult } = require('express-validator/check');
const orderStatus = require('../classes/orderStatus');
const fileHelper = require('../utils/file');
const Order = require('../models/orderRetail');
const ObjectId = mongodb.ObjectId;
const errorService = require('../classes/errorService');

// exports.getCargoTrackings = async (req, res, next) => {


//     const currentPage = req.query.page || 1;
//     const perPage = 200;
//     let totalItems;

//     try {
//         const totalItems = await CargoTracking.find().countDocuments();
//         const cargoCargoTrackings = await CargoTracking.find()
//             .skip((currentPage - 1) * perPage)
//             .limit(perPage);

//         res.status(200).json({
//             message: 'Fetched customs succesfully',
//             cargoCargoTrackings: cargoCargoTrackings,
//             totalItems: totalItems
//         })

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }

// }

exports.getCargoTracking = (req, res, next) => {
    const cargoTrackingId = req.params.cargoTrackingId
    

    CargoTracking
        .findById(cargoTrackingId)
        .then(cargoTracking => {

            if (!cargoTracking) {

                const error = new Error('Could not find custom');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'CargoTracking fetched.', cargoTracking: cargoTracking })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('cargoTrackingController', 'getCargoTracking',38, 500, err);

            next(err);

        });

}

exports.postAddCargoTracking = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const cargoTracking = new CargoTracking({
            orderId: req.body.orderId,
            customer: req.body.customer,
            cargoCompany: req.body.cargoCompany,
            trackingNumber: req.body.trackingNumber,
            orderDate: req.body.orderDate,
            shipmentDate: req.body.shipmentDate,
            grandTotal: req.body.grandTotal,
        });
        const result = await cargoTracking.save();
        res.status(201).json({ statusCode: 201, message: 'cargoTracking created!', cargoTrackingId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoTrackingController', 'postAddCargoTracking',70, 500, err);

        next(err);
    }
}

exports.putUpdateCargoTracking = async (req, res, next) => {
    const cargoTrackingId = req.params.cargoTrackingId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newCargoTracking = new CargoTracking({
        orderId: req.body.orderId,
        customer: req.body.customer,
        cargoCompany: req.body.cargoCompany,
        trackingNumber: req.body.trackingNumber,
        orderDate: req.body.orderDate,
        shipmentDate: req.body.shipmentDate,
        grandTotal: req.body.grandTotal,
    });


    try {
        const oldCargoTracking = await (await CargoTracking.findById(cargoTrackingId));
        if (!oldCargoTracking) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


      
        oldCargoTracking.orderId =newCargoTracking.orderId;
        oldCargoTracking.customer=newCargoTracking.customer;
        oldCargoTracking.cargoCompany=newCargoTracking.cargoCompany;
        oldCargoTracking.trackingNumber=newCargoTracking.trackingNumber;
        oldCargoTracking.orderDate=newCargoTracking.orderDate;
        oldCargoTracking.shipmentDate=newCargoTracking.shipmentDate;
        oldCargoTracking.grandTotal=newCargoTracking.grandTotal;



        const result = await oldCargoTracking.save();

        res.status(200).json({ message: 'CargoTracking updated!', cargoTracking: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoTrackingController', 'putUpdateCargoTracking',107, 500, err);

        next(err);
    }
};

exports.deleteCargoTracking = async (req, res, next) => {
    const cargoTrackingId = req.params.cargoTrackingId;
    try {
        const cargoTracking = await CargoTracking.findById(cargoTrackingId);

        if (!cargoTracking) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await CargoTracking.findByIdAndRemove(cargoTrackingId);

        res.status(200).json({ message: 'Deleted Cargo Tracking.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoTrackingController', 'deleteCargoTracking',160, 500, err);

        next(err);
    }
};

exports.getCargoTrackings = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    // const status = req.query.status || orderStatus.ShipmentSuccessed;
    const status =  orderStatus.ShipmentSuccessed;
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

    console.log('**********customer orders')

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
        errorService.sendErrorNotificationViaEmail('cargoTrackingController', 'getCargoTrackings',185, 500, err);

        next(err);
    }

}