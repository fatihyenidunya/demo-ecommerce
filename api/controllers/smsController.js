const mongodb = require('mongodb');
const SmsSetting = require('../models/smsSetting');
const Sms = require('../models/sms');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;


exports.postAddSms = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const sms = new Sms({
            gsmNo: req.body.gsmNo,
            customer: req.body.customer,
            message: req.body.message,
            messageFor: req.body.messageFor,
            status: req.body.status,
            success: req.body.success

        });
        const result = await sms.save();
        res.status(201).json({ statusCode: 201, message: 'Sms added!', smsId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('smsController', 'postAddSms', 11, 500, err);

        next(err);
    }
}


// exports.getSmses = async (req, res, next) => {


//     const currentPage = req.query.page || 1;
//     const pageSize = req.query.pagesize;
//     const perPage = Number(pageSize);


//     try {
//         const totalSms = await Sms.find().countDocuments();
//         const smses = await Sms.find()
//             .skip((currentPage - 1) * perPage)
//             .limit(perPage);

//         res.status(200).json({
//             message: 'Fetched succesfully',
//             smses: smses,
//             totalSms: totalSms
//         })

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }

// }



exports.getSmses = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    const status =  req.query.status;
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';


   

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

    if (status != 'All') {
        if (status != 'undefined') {
            statusTxt = '"status":"' + status + '",';

        }
    }

    queryTxt = '{' + customerTxt + statusTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);

 


    try {
        const items = await Sms.find(query).countDocuments();

        const smses = await Sms
            .find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });



        res.status(200).json({
            message: 'Fetched customer Sms succesfully',
            smses: smses,
            totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('smsController', 'getSmses', 80, 500, err);

        next(err);
    }

}





exports.postAddSmsSetting = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


        const newSmsSetting = new SmsSetting({
            company: req.body.company,
            api: req.body.api,
            userCode: req.body.userCode,
            password: req.body.password,
            msgHeader:  req.body.msgHeader

        });


        const result = await newSmsSetting.save();
        res.status(201).json({ statusCode: 201, message: 'Sms added!', smsSetting: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('smsController', 'postAddSmsSetting', 159, 500, err);

        next(err);
    }
}


exports.getSmsSettings = async (req, res, next) => {


    try {
        const totalSmsSetting = await SmsSetting.find().countDocuments();
        const smsSettings = await SmsSetting.find();
           

        res.status(200).json({
            message: 'Fetched succesfully',
            smsSettings: smsSettings,
            totalSmsSetting: totalSmsSetting
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('smsController', 'getSmsSettings', 196, 500, err);

        next(err);
    }

}


exports.getSmsSetting = (req, res, next) => {
    const smsSettingId = req.params.smsSettingId


    SmsSetting
        .findById(smsSettingId)
        .then(smsSetting => {

            if (!smsSetting) {

                const error = new Error('Could not find Sms Setting');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Sms Setting fetched.', smsSetting: smsSetting })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('smsController', 'getSmsSetting', 222, 500, err);

            next(err);

        });

}


exports.putUpdateSmsSetting = async (req, res, next) => {
    const smsSettingId = req.params.smsSettingId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }



    const newSmsSetting = new SmsSetting({
        company: req.body.company,
        api: req.body.api,
        userCode: req.body.userCode,
        password: req.body.password,
        msgHeader:  req.body.msgHeader

    });

    try {
        const oldSmsSetting = await (await SmsSetting.findById(smsSettingId));
        if (!oldSmsSetting) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldSmsSetting.company = newSmsSetting.company;
        oldSmsSetting.api = newSmsSetting.api;
        oldSmsSetting.userCode = newSmsSetting.userCode;
        oldSmsSetting.password = newSmsSetting.password;
        oldSmsSetting.msgHeader = newSmsSetting.msgHeader;



        const result = await oldSmsSetting.save();

        res.status(200).json({ message: 'Sms Setting updated!', smsSetting: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('smsController', 'putUpdateSmsSetting', 255, 500, err);

        next(err);
    }
};


exports.deleteSmsSetting = async (req, res, next) => {
    const smsSettingId = req.params.smsSettingId;
    try {
        const smsSetting = await SmsSetting.findById(smsSettingId);

        if (!smsSetting) {
            const error = new Error('Could not find smsSetting.');
            error.statusCode = 404;
            throw error;
        }


        await SmsSetting.findByIdAndRemove(smsSettingId);

        res.status(200).json({ message: 'Deleted smsSetting.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('smsController', 'deleteSmsSetting', 306, 500, err);

        next(err);
    }
};