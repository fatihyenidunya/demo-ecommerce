const mongodb = require('mongodb');
const Comment = require('../models/comment');
const { validationResult } = require('express-validator/check');
const errorService = require('../classes/errorService');
const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getComments_ = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);

    try {
        const totalComment = await Comment.find().countDocuments();
        const comments = await Comment.find()
            .populate({ path: 'productId', select: 'imageUrl turkishTitle' })
            .populate({ path: 'customerId', select: 'userName' })
            .skip((currentPage - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });


        res.status(200).json({
            message: 'Fetched succesfully',
            comments: comments,
            totalComment: totalComment
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('commentController', 'getComments_',9, 500, err);

        next(err);
    }

}


exports.getComments = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const status = req.query.status || 'Unpublished';
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';

    let perPage = Number(pageSize);

    let queryTxt = "";

    let statusTxt = "";

    let sta;

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (status != 'Hepsi') {
        if (status != 'undefined') {

            if (status == 'Yayinlanmadi') {
                sta = false;
            }
            if (status == 'Yayinlandi') {
                sta = true;
            }

            statusTxt = '"publish":"' + sta + '",';

        }
    }

    queryTxt = '{' + statusTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);

   

    try {
        const totalComment = await Comment.find(query).countDocuments();
        const comments = await Comment.find(query)
            .populate({ path: 'productId', select: 'title image' })
            .populate({ path: 'customerId', select: 'name surname' })
            .skip((currentPage - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });



        res.status(200).json({
            message: 'Fetched succesfully',
            comments: comments,
            totalComment: totalComment
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('commentController', 'getComments',44, 500, err);
        next(err);
    }

}

exports.getDashboardComments = async (req, res, next) => {



    try {
      
        const comments = await Comment.find()
            .populate({ path: 'productId', select: 'image title' })
            .populate({ path: 'customerId', select: 'name surname' })  
            .sort({ createdAt: -1 })          
            .limit(10);
           



        res.status(200).json({
            message: 'Fetched succesfully',
            comments: comments
          
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('commentController', 'getDashboardComments',116, 500, err);
        next(err);
    }

}


exports.getComment = async (req, res, next) => {
    const commentId = req.params.commentId


    const comments = await Comment.find({_id:commentId})
        .populate({ path: 'productId', select: 'image title' })
        .populate({ path: 'customerId', select: 'name surname' })
        .exec()
        .then(comment => {

            if (!comment) {

                const error = new Error('Could not find comment');
                err.statusCode = 404;
                throw error;
            }



            res.status(200).json({ message: 'Comment fetched.', comment: comment[0] })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('commentController', 'getComment',148, 500, err);

            next(err);

        });

}

exports.postAddComment = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


        const comment = new Comment({
            productId: req.body.productId,
            customerId: req.body.customerId,
            comment: req.body.comment,
            ranking: req.body.ranking,


        });


        const result = await comment.save();
        res.status(201).json({ statusCode: 201, message: 'Comment sended!', commentId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('commentController', 'postAddComment',184, 500, err);
        next(err);
    }
}

exports.putUpdateComment = async (req, res, next) => {
    const commentId = req.params.commentId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }


    // const comment = new Comment({
    //     productId: req.body.productId,
    //     customerId: req.body.customerId,
    //     comment: req.body.comment,
    //     ranking: req.body.ranking,
    //     order: req.body.order,
    //     publish: req.body.publish

    // });

    try {
        const oldComment = await (await Comment.findById(commentId));
        if (!oldComment) {
            const error = new Error('Could not find comment.');
            error.statusCode = 404;
            throw error;
        }


        oldComment.publish = req.body.publish;


        const result = await oldComment.save();

        res.status(200).json({ message: 'Comment updated!', comment: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('commentController', 'putUpdateComment',219, 500, err);

        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    const commentId = req.params.commentId;
    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            const error = new Error('Could not find comment.');
            error.statusCode = 404;
            throw error;
        }


        await Comment.findByIdAndRemove(commentId);

        res.status(200).json({ message: 'Deleted comment.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('commentController', 'deleteComment',264, 500, err);

        next(err);
    }
};