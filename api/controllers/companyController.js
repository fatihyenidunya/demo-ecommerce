const mongodb = require('mongodb');
const Company = require('../models/company');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getCompanies = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await Company.find().countDocuments();
        const companies = await Company.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched customs succesfully',
            companies: companies,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getCompany = (req, res, next) => {
    const companyId = req.params.companyId
    

    Company
        .findById(companyId)
        .then(company => {

            if (!company) {

                const error = new Error('Could not find Raw Material');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'custom fetched.', company: company })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddCompany = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const company = new Company({
            name: req.body.name        
        });
        const result = await company.save();
        res.status(201).json({ statusCode: 201, message: 'Company created!', companyId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateCompany = async (req, res, next) => {
    const companyId = req.params.companyId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newCompany = new Company({
        name: req.body.name
        
    });


    try {
        const oldCompany = await (await Company.findById(companyId));
        if (!oldCompany) {
            const error = new Error('Could not find RawMaterial.');
            error.statusCode = 404;
            throw error;
        }


        oldCompany.name = newCompany.name;
       



        const result = await oldCompany.save();

        res.status(200).json({ message: 'Company updated!', company: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteCompany = async (req, res, next) => {
    const companyId = req.params.companyId;
    try {
        const company = await Company.findById(companyId);

        if (!company) {
            const error = new Error('Could not find Raw Material.');
            error.statusCode = 404;
            throw error;
        }


        await Company.findByIdAndRemove(companyId);

        res.status(200).json({ message: 'Deleted Company.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};