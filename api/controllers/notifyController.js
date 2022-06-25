const mongodb = require('mongodb');
const OrderNotify = require('../models/orderNotify');
const OrderOperationNotify = require('../models/orderOperationNotify');
const { validationResult } = require('express-validator/check');
const WareHouseNotify = require('../models/wareHouseNotify');
const orderStatus = require('../classes/orderStatus');
const fileHelper = require('../utils/file');
const io = require('../socket');
const errorService = require('../classes/errorService');


const ObjectId = mongodb.ObjectId;


exports.getNotifies = async (req, res, next) => {

    const status = req.params.status
    const seen = req.params.seen
    const checked = req.params.checked
    const notifyFor = req.params.notifyfor;

    const userName = req.params.username;


    try {

        const unSeenCount = await OrderOperationNotify.find({ 'status': status, isChecked: false, 'notifyFor': notifyFor, 'orderOwner': userName }).countDocuments();
        const notifies = await OrderOperationNotify.find({ 'status': status, 'notifyFor': notifyFor, 'orderOwner': userName }).sort({ createdAt: -1 }).limit(30);



        res.status(200).json({
            message: 'Fetched notifies succesfully',
            notifies: notifies,
            unSeenCount: unSeenCount

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'getNotifies', 15, 500, err);

        next(err);
    }

}

exports.getRetailerNotifies = async (req, res, next) => {

    const status = req.params.status
    const seen = req.params.seen
    const checked = req.params.checked
    const notifyFor = req.params.notifyfor;

    const userName = req.params.username;


    try {

        const unSeenCount = await OrderNotify.find({ 'status': status, isChecked: false, 'notifyFor': notifyFor }).countDocuments();
        const notifies = await OrderNotify.find({ 'status': status, 'notifyFor': notifyFor }).sort({ createdAt: -1 }).limit(30);

        console.log(notifies)


        res.status(200).json({
            message: 'Fetched notifies succesfully',
            notifies: notifies,
            unSeenCount: unSeenCount

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'getRetailerNotifies', 50, 500, err);

        next(err);
    }

}

exports.getOrderNotifies = async (req, res, next) => {

    const status = req.params.status
    const seen = req.params.seen
    const checked = req.params.checked
    const notifyFor = req.params.notifyfor;
    const owner = req.params.owner;
    const role = req.params.role;



    try {

        let unSeenCount;
        let notifies;


        unSeenCount = await OrderNotify.find({ isChecked: false, 'notifyFor': notifyFor, 'userName': owner }).countDocuments();
        notifies = await OrderNotify.find({ 'notifyFor': notifyFor, 'userName': owner }).sort({ createdAt: -1 }).limit(20);





        res.status(200).json({
            message: 'Fetched notifies succesfully',
            notifies: notifies,
            unSeenCount: unSeenCount

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'getOrderNotifies', 86, 500, err);

        next(err);
    }

}


exports.getOrderRetailerNotifies = async (req, res, next) => {

    const status = req.params.status
    const seen = req.params.seen
    const checked = req.params.checked
    const notifyFor = req.params.notifyfor;
    const owner = req.params.owner;
    const role = req.params.role;



    try {

        let unSeenCount;
        let notifies;


        // unSeenCount = await OrderNotify.find({'status': status, isChecked: false, 'notifyFor': notifyFor }).countDocuments();
        // notifies = await OrderNotify.find({'status': status, 'notifyFor': notifyFor }).sort({ createdAt: -1 }).limit(20);

        unSeenCount = await OrderNotify.find({ isChecked: false, 'notifyFor': notifyFor, status: orderStatus.PendingApproval }).countDocuments();
        notifies = await OrderNotify.find({ 'notifyFor': notifyFor, isChecked: false, status: orderStatus.PendingApproval }).sort({ createdAt: -1 }).limit(30);


        console.log('unseen');
        console.log(unSeenCount)


        res.status(200).json({
            message: 'Fetched notifies succesfully',
            notifies: notifies,
            unSeenCount: unSeenCount

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'getOrderRetailerNotifies', 129, 500, err);

        next(err);
    }

}


exports.getWarehouseNotifies = async (req, res, next) => {

    const status = req.params.status
    const seen = req.params.seen
    const checked = req.params.checked
    const notifyFor = req.params.notifyfor;


    try {

        const unSeenCount = await WareHouseNotify.find({ 'status': status, isChecked: false, 'notifyFor': notifyFor }).countDocuments();
        const notifies = await WareHouseNotify.find({ 'status': status, 'notifyFor': notifyFor }).sort({ createdAt: -1 }).limit(20);

        //    console.log(notifies)

        res.status(200).json({
            message: 'Fetched notifies succesfully',
            notifies: notifies,
            unSeenCount: unSeenCount

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'getWarehouseNotifies', 176, 500, err);

        next(err);
    }

}


exports.getNotifyList = async (req, res, next) => {

    const notifyFor = req.params.notifyfor;


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
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

    let statusTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    let notify = 'customer';

    if (status != 'Hepsi') {
        if (status != 'undefined') {
            statusTxt = '"status":"' + status + '",' + '"notifyFor":"' + notify + '",';

        }
    }

    queryTxt = '{' + statusTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);

    // console.log('');
    console.log(query)

    let notifies;
    try {
        const items = await OrderOperationNotify.find(query).countDocuments();

        if (notifyFor === 'operation') {
            notifies = await OrderOperationNotify
                .find(query)
                .skip((currentPage - 1) * perPage)
                .limit(perPage).sort({ createdAt: -1 });
        }

        if (notifyFor === 'warehouse') {
            notifies = await WareHouseNotify
                .find(query)
                .skip((currentPage - 1) * perPage)
                .limit(perPage).sort({ createdAt: -1 });
        }


      


        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            orderNotifyList: notifies,
            totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'getNotifyList', 210, 500, err);

        next(err);
    }

}



exports.checkNotify = async (req, res, next) => {
    const orderId = ObjectId(req.params.orderId);
    const number = req.params.number;

    const status = req.params.status;




    try {




        const warehouseNotify = await WareHouseNotify.find({ 'orderId': orderId, $or: [{ number: { $eq: number } }, { number: { $lt: number } }] }).sort({ createdAt: -1 });

        const checkedDate = Date.now;



        for (let n of warehouseNotify) {

            const result1 = await WareHouseNotify.updateOne({ _id: n._id }, { isChecked: true }, { checkedDate: checkedDate });

        }


        io.addNamespace('/warehouse').emit('updateNotifyWarehouse', { updateNotify: true });



        res.status(200).json({
            message: 'Fetched customer basket products succesfully'


        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'checkNotify', 298, 500, err);

        next(err);
    }

}

exports.checkOrderOperationNotify = async (req, res, next) => {
    const orderId = ObjectId(req.params.orderId);
    const number = req.params.number;
    const status = req.params.status;




    try {




        const _orderOperationNotify = await OrderOperationNotify.find({ 'orderId': orderId, $or: [{ number: { $eq: number } }, { number: { $lt: number } }] }).sort({ createdAt: -1 });

        const checkedDate = Date.now;


        for (let n of _orderOperationNotify) {

            const result1 = await OrderOperationNotify.updateOne({ _id: n._id }, { isChecked: true }, { checkedDate: checkedDate });

        }


        io.addNamespace('/operations').emit('operation', { updateNotify: true });



        res.status(200).json({
            message: 'Fetched customer basket products succesfully'


        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notifyController', 'checkOrderOperationNotify', 346, 500, err);

        next(err);
    }

}