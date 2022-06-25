const mongodb = require('mongodb');
const NotificationEmail = require('../models/notificationEmail');
const { validationResult } = require('express-validator/check');
const errorService = require('../classes/errorService');
const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getNotificationEmails = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);


    try {
        const totalEmail = await NotificationEmail.find().countDocuments();
        const emails = await NotificationEmail.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            emails: emails,
            totalEmail: totalEmail
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notificationEmailController', 'getNotificationEmails', 9, 500, err);

        next(err);
    }

}

exports.getNotificationEmail = (req, res, next) => {
    const emailId = req.params.emailId


    NotificationEmail
        .findById(emailId)
        .then(email => {

            if (!email) {

                const error = new Error('Could not find product');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'email fetched.', email: email })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('notificationEmailController', 'getNotificationEmail', 40, 500, err);

            next(err);

        });

}

exports.getNotificationEmailWhatFor = (req, res, next) => {
    const whatFor = req.params.whatFor;


    NotificationEmail
        .find({ whatFor: whatFor })
        .then(email => {

            if (!email) {

                const error = new Error('Could not find product');
                err.statusCode = 404;
                throw error;
            }



            res.status(200).json({ message: 'email fetched.', emails: email })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('notificationEmailController', 'getNotificationEmailWhatFor', 72, 500, err);

            next(err);

        });

}


exports.postAddNotificationEmail = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const notificationEmail = new NotificationEmail({
            whose: req.body.whose,
            email: req.body.email,
            whatFor: req.body.whatFor

        });
        const result = await notificationEmail.save();
        res.status(201).json({ statusCode: 201, message: 'Product created!', emailId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notificationEmailController', 'postAddNotificationEmail', 107, 500, err);

        next(err);
    }
}



exports.putUpdateNotificationEmail = async (req, res, next) => {
    const emailId = req.params.emailId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }




    const newNotificationEmail = new NotificationEmail({
        whose: req.body.whose,
        email: req.body.email,
        whatFor: req.body.whatFor
    });

    try {
        const oldNotificationEmail = await (await NotificationEmail.findById(emailId));
        if (!oldNotificationEmail) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldNotificationEmail.whose = newNotificationEmail.whose;
        oldNotificationEmail.email = newNotificationEmail.email;
        oldNotificationEmail.whatFor = newNotificationEmail.whatFor;




        const result = await oldNotificationEmail.save();

        res.status(200).json({ message: 'Product updated!', email: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notificationEmailController', 'putUpdateNotificationEmail', 143, 500, err);

        next(err);
    }
};



exports.deleteNotificationEmail = async (req, res, next) => {
    const emailId = req.params.emailId;
    try {
        const email = await NotificationEmail.findById(emailId);

        if (!email) {
            const error = new Error('Could not find email.');
            error.statusCode = 404;
            throw error;
        }


        await NotificationEmail.findByIdAndRemove(emailId);

        res.status(200).json({ message: 'Deleted oldNotificationEmail.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('notificationEmailController', 'deleteNotificationEmail', 192, 500, err);

        next(err);
    }
};