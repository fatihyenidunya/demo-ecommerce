const mongodb = require('mongodb');
const Message = require('../../models/message');
const { validationResult } = require('express-validator/check');
const errorService = require('../../classes/errorService');


const ObjectId = mongodb.ObjectId;



exports.postMessage = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


        const message = new Message({
            name: req.body.name,
            lastName: req.body.lastName,
            mail: req.body.mail,
            subject: req.body.subject,
            phone: req.body.phone,
            message: req.body.message,

        });


        const result = await message.save();

 
        res.status(201).json({ statusCode: 201, message: 'Mesajınız iletildi!' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('contactController', 'postMessage', 11, 500, err);

        next(err);
    }
}


