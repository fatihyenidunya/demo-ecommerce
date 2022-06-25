const mongodb = require('mongodb');
const Custom = require('../models/custom');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getCustoms = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await Custom.find().countDocuments();
        const customs = await Custom.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched customs succesfully',
            customs: customs,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getCustom = (req, res, next) => {
    const customId = req.params.customId
    

    Custom
        .findById(customId)
        .then(custom => {

            if (!custom) {

                const error = new Error('Could not find custom');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'custom fetched.', custom: custom })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddCustom = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const custom = new Custom({
            company: req.body.company,
            officer: req.body.officer,
            phone: req.body.phone,
            mobil: req.body.mobil,
            email: req.body.email,
        });
        const result = await custom.save();
        res.status(201).json({ statusCode: 201, message: 'Custom created!', customId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateCustom = async (req, res, next) => {
    const customId = req.params.customId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newCustom = new Custom({
        company: req.body.company,
        officer: req.body.officer,
        phone: req.body.phone,
        mobil: req.body.mobil,
        email: req.body.email,
    });


    try {
        const oldCustom = await (await Custom.findById(customId));
        if (!oldCustom) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldCustom.company = newCustom.company;
        oldCustom.officer = newCustom.officer;
        oldCustom.phone = newCustom.phone;
        oldCustom.mobil = newCustom.mobil;
        oldCustom.email = newCustom.email;



        const result = await oldCustom.save();

        res.status(200).json({ message: 'Custom updated!', custom: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteCustom = async (req, res, next) => {
    const customId = req.params.customId;
    try {
        const custom = await Custom.findById(customId);

        if (!custom) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await Custom.findByIdAndRemove(customId);

        res.status(200).json({ message: 'Deleted custom.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};