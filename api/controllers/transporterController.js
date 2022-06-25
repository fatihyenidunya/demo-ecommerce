const mongodb = require('mongodb');
const Transporter = require('../models/transporter');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getTransporters = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await Transporter.find().countDocuments();
        const transporters = await Transporter.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched transporters succesfully',
            transporters: transporters,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getTransporter = (req, res, next) => {
    const transporterId = req.params.transporterId
    console.log(req.params)

    Transporter
        .findById(transporterId)
        .then(transporter => {

            if (!transporter) {

                const error = new Error('Could not find transporter');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'transporter fetched.', transporter: transporter })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddTransporter = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const transporter = new Transporter({
            company: req.body.company,
            officer: req.body.officer,
            phone: req.body.phone,
            mobil: req.body.mobil,
            email: req.body.email,
        });
        const result = await transporter.save();
        res.status(201).json({ statusCode: 201, message: 'Transporter created!', transporterId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateTransporter = async (req, res, next) => {
    const transporterId = req.params.transporterId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newTransporter = new Transporter({
        company: req.body.company,
        officer: req.body.officer,
        phone: req.body.phone,
        mobil: req.body.mobil,
        email: req.body.email,
    });


    try {
        const oldTransporter = await (await Transporter.findById(transporterId));
        if (!oldTransporter) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldTransporter.company = newTransporter.company;
        oldTransporter.officer = newTransporter.officer;
        oldTransporter.phone = newTransporter.phone;
        oldTransporter.mobil = newTransporter.mobil;
        oldTransporter.email = newTransporter.email;



        const result = await oldTransporter.save();

        res.status(200).json({ message: 'Transporter updated!', transporter: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



exports.deleteTransporter = async (req, res, next) => {
    const transporterId = req.params.transporterId;
    try {
        const transporter = await Transporter.findById(transporterId);

        if (!transporter) {
            const error = new Error('Could not find transporter.');
            error.statusCode = 404;
            throw error;
        }


        await Transporter.findByIdAndRemove(transporterId);

        res.status(200).json({ message: 'Deleted transporter.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};