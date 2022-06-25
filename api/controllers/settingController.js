const mongodb = require('mongodb');
const Setting = require('../models/setting');
const { validationResult } = require('express-validator/check');
const errorService = require('../classes/errorService');
const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getSettings = async (req, res, next) => {




    try {

        const settings = await Setting.find();

        res.status(200).json({
            message: 'Fetched settings succesfully',
            settings: settings,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('settingController', 'getSettings', 9, 500, err);
        next(err);
    }

}

exports.getSetting = (req, res, next) => {
    const company = req.params.company


    Setting
        .find({ company: company })
        .then(setting => {

            if (!setting) {

                const error = new Error('Could not find setting');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'setting fetched.', setting: setting[0] })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('settingController', 'getSetting', 34, 500, err);

            next(err);

        });

}

exports.postAddSetting = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


        const setting = new Setting({
            company: req.body.company,
            userName: req.body.userName,
            password: req.body.password
        });
        const result = await setting.save();
        res.status(201).json({ statusCode: 201, message: 'setting created!', settingId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('settingController', 'postAddSetting', 66, 500, err);

        next(err);
    }
}

exports.putUpdateSetting = async (req, res, next) => {
    const company = req.params.company;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newSetting = new Setting({
        userName: req.body.userName,
        password: req.body.password
    });


    try {
 
        await Setting.updateOne({ company: company }, { userName: newSetting.userName, password: newSetting.password });

        res.status(200).json({ message: 'setting updated!'});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('settingController', 'putUpdateSetting', 97, 500, err);

        next(err);
    }
};



exports.deleteSetting = async (req, res, next) => {
    const settingId = req.params.settingId;
    try {
        const setting = await Setting.findById(settingId);

        if (!setting) {
            const error = new Error('Could not find setting.');
            error.statusCode = 404;
            throw error;
        }


        await Setting.findByIdAndRemove(settingId);

        res.status(200).json({ message: 'Deleted setting.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('settingController', 'deleteSetting', 129, 500, err);

        next(err);
    }
};