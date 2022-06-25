const mongodb = require('mongodb');
const DeliveryTerms = require('../models/deliveryTerms');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getDeliveryTerms = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);

    try {
        const totalAccount = await DeliveryTerms.find().countDocuments();
        const deliveryTerms = await DeliveryTerms.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            deliveryTerms: deliveryTerms,
            totalAccount: totalAccount
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getDeliveryTerm = (req, res, next) => {
    const deliveryTermId = req.params.deliveryTermId


    DeliveryTerms
        .findById(deliveryTermId)
        .then(deliveryTerm => {

            if (!deliveryTerm) {

                const error = new Error('Could not find blog');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Slider fetched.', deliveryTerm: deliveryTerm })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddDeliveryTerm= async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const deliveryTerm = new DeliveryTerms({

            deliveryTerm: req.body.deliveryTerm         

        });
        const result = await deliveryTerm.save();
        res.status(201).json({ statusCode: 201, message: 'Term created!', deliveryTermId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateDeliveryTerm= async (req, res, next) => {
    const deliveryTermId = req.params.deliveryTermId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }






    const newDeliveryTerm = new DeliveryTerms({
        deliveryTerm: req.body.deliveryTerm
     
    });




    try {
        const oldDeliveryTerm = await (await DeliveryTerms.findById(deliveryTermId));
        if (!oldDeliveryTerm) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldDeliveryTerm.deliveryTerm = newDeliveryTerm.deliveryTerm;


        const result = await oldDeliveryTerm.save();

        res.status(200).json({ message: 'Term updated!', deliveryTerm: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteDeliveryTerm= async (req, res, next) => {
    const deliveryTermId = req.params.deliveryTermId;
    try {
        const deliveryTerm = await DeliveryTerms.findById(deliveryTermId);

        if (!deliveryTerm) {
            const error = new Error('Could not find blog.');
            error.statusCode = 404;
            throw error;
        }


        await DeliveryTerms.findByIdAndRemove(deliveryTermId);

        res.status(200).json({ message: 'Deleted account.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};