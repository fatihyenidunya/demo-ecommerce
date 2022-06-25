const mongodb = require('mongodb');
const Message = require('../models/message');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getMessages = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);

    try {
        const totalItems = await Message.find().countDocuments();
        const messages = await Message.find()
            .skip((currentPage - 1) * perPage)
            .sort({ createdAt: -1 })
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            messages: messages,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('messageController', 'getMessages', 9, 500, err);

        next(err);
    }

}

exports.getDashboardMessages = async (req, res, next) => {



    try {

        const messages = await Message.find().sort({ createdAt: -1 })

            .limit(10);

        res.status(200).json({
            message: 'Fetched succesfully',
            messages: messages

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('messageController', 'getDashboardMessages', 40, 500, err);

        next(err);
    }

}

exports.getMessage = (req, res, next) => {
    const messageId = req.params.messageId


    Message
        .findById(messageId)
        .then(message => {

            if (!message) {

                const error = new Error('Could not find Message');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Message fetched.', message: message })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('messageController', 'getMessage', 67, 500, err);

            next(err);

        });

}

exports.postAddMessage = async (req, res, next) => {

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
            mail: req.body.mail,
            phone: req.body.phone,
            subject: req.body.subject,
            message: req.body.message,
            type: req.body.type,
            answered: req.body.answered,
            userName: req.body.userName,
            answer: req.body.answer,
            sendedBy: req.body.sendedBy

        });
        const result = await message.save();
        res.status(201).json({ statusCode: 201, message: 'Message created!', messageId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('messageController', 'postAddMessage', 99, 500, err);

        next(err);
    }
}



exports.putUpdateMessage = async (req, res, next) => {
    const messageId = req.params.messageId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }


    const newMessage = new Message({
        name: req.body.name,
        mail: req.body.mail,
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message,
        type: req.body.type,
        answered: req.body.answered,
        userName: req.body.userName,
        answer: req.body.answer,
        sendedBy: req.body.sendedBy

    });

    try {
        const oldMessage = await (await Message.findById(messageId));
        if (!oldMessage) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldMessage.name = newMessage.name;
        oldMessage.mail = newMessage.mail;
        oldMessage.phone = newMessage.phone;
        oldMessage.subject = newMessage.subject;
        oldMessage.message = newMessage.message;
        oldMessage.type = newMessage.type;
        oldMessage.answered = newMessage.answered;
        oldMessage.userName = newMessage.userName;
        oldMessage.answer = newMessage.answer;
        oldMessage.sendedBy = newMessage.sendedBy;


        const result = await oldMessage.save();

        res.status(200).json({ message: 'Message updated!', message: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('messageController', 'putUpdateMessage', 140, 500, err);

        next(err);
    }
};



exports.deleteMessage = async (req, res, next) => {
    const messageId = req.params.messageId;
    try {
        const message = await Message.findById(messageId);

        if (!message) {
            const error = new Error('Could not find message.');
            error.statusCode = 404;
            throw error;
        }


        await Message.findByIdAndRemove(messageId);

        res.status(200).json({ message: 'Deleted message.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('messageController', 'deleteMessage', 200, 500, err);

        next(err);
    }
};