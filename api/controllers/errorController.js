const mongodb = require('mongodb');
const Error = require('../models/error');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;



exports.getErrors = async (req, res, next) => {




    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const controller = req.query.controller || '';
    const fixed = req.query.fixed || false;
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';
    const code = req.query.code;


    let totalItems = 40;


    let perPage = Number(pageSize);


    let queryTxt = "";
    let controllerTxt = "";
    let fixedTxt = "";
    let codeTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (controller != '') {
        if (controller != 'undefined') {
            controllerTxt = '"controller":{ "\$regex" : "' + controller + '", "\$options" : "i"},';
        }
    }

    if (fixed != 'All') {
        if (fixed != 'undefined') {
            fixedTxt = '"fixed":' + fixed + ',';
        }
    }



    if (code != 'All') {
        codeTxt = '"code":"' + code + '",';
    }

    queryTxt = '{' + controllerTxt + fixedTxt + codeTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);
    // console.log('');
    console.log(query)




    try {
        const items = await Error.find(query).countDocuments();

        const errors = await Error
            .find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });




        res.status(200).json({
            message: 'Fetched errors succesfully',
            errors: errors,
            totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getError = (req, res, next) => {
    const errorId = req.params.errorId


    Error
        .findById(errorId)
        .then(error => {

            if (!error) {

                const error = new Error('Could not find error');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'error fetched.', error: error })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddError = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const error = new Error({
            controller: req.body.controller,
            function: req.body.function,
            line: req.body.line,
            detail: req.body.detail,
            code: req.body.code,
            fixed: req.body.fixed
        });

        const result = await error.save();
        res.status(201).json({ statusCode: 201, message: 'Error occured', errorId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateError = async (req, res, next) => {
    const errorId = req.params.errorId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }


    const newError = new Error({
        // controller: req.body.controller,
        // function: req.body.function,
        // line: req.body.line,
        // detail: req.body.detail,
        // code: req.body.code,
        fixed: req.body.fixed
    });


    try {
        const oldError = await (await Error.findById(errorId));
        if (!oldError) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        // oldError.controller = newError.controller;
        // oldError.function = newError.function;
        // oldError.line = newError.line;
        // oldError.detail = newError.detail;
        // oldError.code = newError.code;
        oldError.fixed = newError.fixed;



        const result = await oldError.save();

        res.status(200).json({ message: 'Error updated!', error: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteError = async (req, res, next) => {
    const errorId = req.params.errorId;
    try {
        const error = await Error.findById(errorId);

        if (!error) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await Error.findByIdAndRemove(errorId);

        res.status(200).json({ message: 'Deleted error.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};