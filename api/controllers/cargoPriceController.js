const mongodb = require('mongodb');
const CargoPrice = require('../models/cargoPrice');
const { validationResult } = require('express-validator/check');
const errorService = require('../classes/errorService');
const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getCargoPrices = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await CargoPrice.find().countDocuments();
        const cargoPrices = await CargoPrice.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched cargoPrices succesfully',
            cargoPrices: cargoPrices,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoPriceController', 'getCargoPrices',9, 500, err);

        next(err);
    }

}

exports.getCargoPrice = (req, res, next) => {
    const cargoPriceId = req.params.cargoPriceId;


    CargoPrice
        .findById(cargoPriceId)
        .then(cargoPrice => {

            if (!cargoPrice) {

                const error = new Error('Could not find custom');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'cargoPrice fetched.', cargoPrice: cargoPrice })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('cargoPriceController', 'getCargoPrice',39, 500, err);
            next(err);

        });

}


exports.postCheckCargoPrice = (req, res, next) => {

    const price = req.body.price;


    CargoPrice
        .find({ "subLimit": { $lte: price } })
        .then(cargoPrice => {

            if (!cargoPrice) {

                const error = new Error('Could not find custom');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'cargoPrice fetched.', cargoPrice: cargoPrice })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('cargoPriceController', 'postCheckCargoPrice',71, 500, err);
            next(err);

        });

}

exports.postAddCargoPrice = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const cargoPrice = new CargoPrice({
            company: req.body.company,
            type: req.body.type,
            price: req.body.price,
            subLimit: req.body.subLimit,
            limit: req.body.limit,
            currency: req.body.currency
        });
        const result = await cargoPrice.save();
        res.status(201).json({ statusCode: 201, message: 'cargoPrice created!', cargoPriceId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoPriceController', 'postAddCargoPrice',103, 500, err);
        next(err);
    }
}

exports.putUpdateCargoPrice = async (req, res, next) => {
    const cargoPriceId = req.params.cargoPriceId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newCargoPrice = new CargoPrice({
        company: req.body.company,
        type: req.body.type,
        price: req.body.price,
        subLimit: req.body.subLimit,
        limit: req.body.limit,
        currency: req.body.currency
    });


    try {
        const oldCargoPrice = await (await CargoPrice.findById(cargoPriceId));
        if (!oldCargoPrice) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldCargoPrice.company = newCargoPrice.company;
        oldCargoPrice.type = newCargoPrice.type;
        oldCargoPrice.price = newCargoPrice.price;
        oldCargoPrice.subLimit = newCargoPrice.subLimit;
        oldCargoPrice.limit = newCargoPrice.limit;
        oldCargoPrice.currency = newCargoPrice.currency;

        const result = await oldCargoPrice.save();

        res.status(200).json({ message: 'CargoPrice updated!', cargoPrice: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoPriceController', 'putUpdateCargoPrice',138, 500, err);
        next(err);
    }
};

exports.deleteCargoPrice = async (req, res, next) => {
    const cargoPriceId = req.params.cargoPriceId;
    try {
        const cargoPrice = await CargoPrice.findById(cargoPriceId);

        if (!cargoPrice) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await CargoPrice.findByIdAndRemove(cargoPriceId);

        res.status(200).json({ message: 'Deleted CargoCompany.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoPriceController', 'deleteCargoPrice',185, 500, err);
        next(err);
    }
};