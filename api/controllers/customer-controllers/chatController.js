const mongodb = require('mongodb');
const Message = require('../../models/chat');
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
            customer: req.body.customer,
            message: req.body.message
        });


        const result = await message.save();

        const results = await Message.find({ customer: req.body.customer }).sort({ createdAt: -1 });


        res.status(201).json({ statusCode: 201, chats: results });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('chatController', 'postMessage', 10, 500, err);

        next(err);
    }
}


exports.getMessages = async (req, res, next) => {

    const customerId = req.params.customerId;

    try {

        const messages = await Message
            .find({ 'customer': customerId })
            .sort({ createdAt: -1 });


        res.status(200).json({
            message: 'Fetched customer messages succesfully',
            messages: messages

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('chatController', 'getMessages', 47, 500, err);

        next(err);
    }

}


