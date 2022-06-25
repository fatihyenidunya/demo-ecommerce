const mongodb = require('mongodb');
const Chat = require('../models/chat');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getChats = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);

    try {
        const totalChat = await Chat.find().countDocuments();
        const chats = await Chat.find()
            .populate({ path: 'customer', select: 'name surname' })
            .skip((currentPage - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Fetched succesfully',
            chats: chats,
            totalChat: totalChat
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('chatController', 'getChats',9, 500, err);

        next(err);
    }

}

exports.getDashboardChats = async (req, res, next) => {



    try {
       
        const chats = await Chat.find()
            .populate({ path: 'customer', select: 'name surname' })   
            .sort({ createdAt: -1 })        
            .limit(10);

        res.status(200).json({
            message: 'Fetched succesfully',
            chats: chats           
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('chatController', 'getDashboardChats',41, 500, err);
        next(err);
    }

}

exports.getChat = (req, res, next) => {
    const chatId = req.params.chatId


    Chat
        .findById(chatId)
        .populate({ path: 'customer', select: 'userName name surname' })
        .then(chat => {

            if (!chat) {

                const error = new Error('Could not find Message');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Message fetched.', chat: chat })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('chatController', 'getChat',67, 500, err);
            next(err);

        });

}

exports.postAddChat = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


        const chat = new Chat({
            customer: req.body.customer,
            message: req.body.message

        });

        const result = await chat.save();
        res.status(201).json({ statusCode: 201, message: 'Message created!', messageId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('chatController', 'postAddChat',99, 500, err);
        next(err);
    }
}



exports.putUpdateChat = async (req, res, next) => {
    const chatId = req.params.chatId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }


    const newChat = new Chat({      
       
        answered: true,
        answer: req.body.answer,
        userName: req.body.userName

    });

    try {
        const oldChat = await (await Chat.findById(chatId));
        if (!oldChat) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }

        oldChat.answered = newChat.answered;
        oldChat.answer = newChat.answer;
        oldChat.userName = newChat.userName


        const result = await oldChat.save();

        res.status(200).json({ message: 'Message updated!', message: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('chatController', 'putUpdateChat',132, 500, err);
        next(err);
    }
};



exports.deleteChat = async (req, res, next) => {
    const chatId = req.params.chatId;
    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            const error = new Error('Could not find message.');
            error.statusCode = 404;
            throw error;
        }


        await Chat.findByIdAndRemove(chatId);

        res.status(200).json({ message: 'Deleted message.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('chatController', 'deleteChat',177, 500, err);
        next(err);
    }
};