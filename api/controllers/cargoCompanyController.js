const mongodb = require('mongodb');
const CargoCompany = require('../models/cargoCompany');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');

const ObjectId = mongodb.ObjectId;

exports.getCargoCompanies = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await CargoCompany.find().countDocuments();
        const cargoCompanies = await CargoCompany.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched customs succesfully',
            cargoCompanies: cargoCompanies,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoCompanyController', 'getCargoCompanies',10, 500, err);
        next(err);
    }

}

exports.getCargoCompany = (req, res, next) => {
    const cargoCompanyId = req.params.cargoCompanyId
    

    CargoCompany
        .findById(cargoCompanyId)
        .then(cargoCompany => {

            if (!cargoCompany) {

                const error = new Error('Could not find custom');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'cargoCompany fetched.', cargoCompany: cargoCompany })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('cargoCompanyController', 'getCargoCompany',39, 500, err);
            next(err);

        });

}

exports.postAddCargoCompany = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const cargoCompany = new CargoCompany({
            company: req.body.company,
            officer: req.body.officer,
            phone: req.body.phone,
            mobil: req.body.mobil,
            email: req.body.email,
        });
        const result = await cargoCompany.save();
        res.status(201).json({ statusCode: 201, message: 'cargoCompany created!', cargoCompanyId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoCompanyController', 'postAddCargoCompany',70, 500, err);
        next(err);
    }
}

exports.putUpdateCargoCompany = async (req, res, next) => {
    const cargoCompanyId = req.params.cargoCompanyId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newCargoCompany = new CargoCompany({
        company: req.body.company,
        officer: req.body.officer,
        phone: req.body.phone,
        mobil: req.body.mobil,
        email: req.body.email,
    });


    try {
        const oldCargoCompany = await (await CargoCompany.findById(cargoCompanyId));
        if (!oldCargoCompany) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldCargoCompany.company = newCargoCompany.company;
        oldCargoCompany.officer = newCargoCompany.officer;
        oldCargoCompany.phone = newCargoCompany.phone;
        oldCargoCompany.mobil = newCargoCompany.mobil;
        oldCargoCompany.email = newCargoCompany.email;



        const result = await oldCargoCompany.save();

        res.status(200).json({ message: 'CargoCompany updated!', cargoCompany: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoCompanyController', 'putUpdateCargoCompany',104, 500, err);
        next(err);
    }
};

exports.deleteCargoCompany = async (req, res, next) => {
    const cargoCompanyId = req.params.cargoCompanyId;
    try {
        const cargoCompany = await CargoCompany.findById(cargoCompanyId);

        if (!cargoCompany) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await CargoCompany.findByIdAndRemove(cargoCompanyId);

        res.status(200).json({ message: 'Deleted CargoCompany.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('cargoCompanyController', 'deleteCargoCompany',151, 500, err);
        next(err);
    }
};