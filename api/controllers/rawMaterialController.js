const mongodb = require('mongodb');
const RawMaterial = require('../models/rawMaterial');
const RawMaterialStockLog = require('../models/rawMaterialStockLog');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getRawMaterials = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await RawMaterial.find().countDocuments();
        const rawMaterials = await RawMaterial.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched customs succesfully',
            rawMaterials: rawMaterials,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.getRawMaterialStockLog = async (req, res, next) => {



    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const rawMaterialId = req.query.rawmaterialid;
    const perPage = Number(pageSize);


    try {

        const totalLog = await RawMaterialStockLog.find({ rawMaterialId: rawMaterialId }).countDocuments();
        const rawMaterialStockLog = await RawMaterialStockLog.find({ rawMaterialId: rawMaterialId }).skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });


        res.status(200).json({
            message: 'Fetched RawMaterialStockLog succesfully',
            rawMaterialStockLog: rawMaterialStockLog,
            totalLog: totalLog

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getFindRawMaterials = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const product = req.query.name || '';
    const perPage = Number(pageSize);

    console.log('*******************')
    console.log('brabad ' + product)

    let productTxt = '{}';

    if (product != '') {
        if (product != 'undefined') {
            productTxt = '{"name":{ "\$regex" : "' + product + '", "\$options" : "i"}}';
        }
    }

    let query = JSON.parse(productTxt);



    try {
        const totalRawMaterial = await RawMaterial.find(query).countDocuments();
        const rawMaterials = await RawMaterial.find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ order: 1 });

        console.log(rawMaterials)


        res.status(200).json({
            message: 'Fetched rawMaterials succesfully',
            rawMaterials: rawMaterials,
            totalRawMaterial: totalRawMaterial
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getRawMaterial = (req, res, next) => {
    const rawMaterialId = req.params.rawMaterialId


    RawMaterial
        .findById(rawMaterialId)
        .then(rawMaterial => {

            if (!rawMaterial) {

                const error = new Error('Could not find Raw Material');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'custom fetched.', rawMaterial: rawMaterial })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}


exports.postUpdateRawMaterialStock = async (req, res, next) => {

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const error = new Error('Validation failed');
    //   error.statusCode = 422;
    //   error.data = errors.array();
    //   throw error;
    // }

    let message;
    let closed;

    try {

        const rawMaterialId = ObjectId(req.body.productId);

        const rawMaterial = await RawMaterial.findById(rawMaterialId);

        console.log(req.body.rawMaterialId);

        let rawMaterialStockLog = new RawMaterialStockLog();

        rawMaterialStockLog.previousStock = rawMaterial.stock;
        rawMaterialStockLog.material = rawMaterial.name;
        rawMaterialStockLog.userName = req.body.userName;
        rawMaterialStockLog.operation = req.body.operation;
        rawMaterialStockLog.stockNote = req.body.stockNote;
        rawMaterialStockLog.rawMaterialId = rawMaterialId;
        rawMaterialStockLog.number = Number(req.body.number);

        if (req.body.operation === "add") {
            rawMaterial.stock += Number(req.body.number);

            rawMaterialStockLog.lastStock = rawMaterial.stock;
            await rawMaterialStockLog.save();
        } else {

            console.log(' çıkarmalı')

            rawMaterial.stock -= Number(req.body.number);
            rawMaterialStockLog.lastStock = rawMaterial.stock;
            await rawMaterialStockLog.save();

        }

        if (rawMaterial.stock >= 0) {
            const result = await rawMaterial.save();
            message = 'Stock Updated!';
            closed = true;
        }
        else {
            message = 'Stok sıfırın altına inemez'
            closed = false;
        }





        res.status(201).json({ statusCode: 201, message: message, closed: closed });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.postAddRawMaterial = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const rawMaterial = new RawMaterial({
            name: req.body.name,
            stock: req.body.stock,
            stockEntity: req.body.stockEntity
        });
        const result = await rawMaterial.save();
        res.status(201).json({ statusCode: 201, message: 'Raw Material created!', rawMaterialId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateRawMaterial = async (req, res, next) => {
    const rawMaterialId = req.params.rawMaterialId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newRawMaterial = new RawMaterial({
        name: req.body.name,
        stock: req.body.stock,
        stockEntity: req.body.stockEntity
    });


    try {
        const oldRawMaterial = await (await RawMaterial.findById(rawMaterialId));
        if (!oldRawMaterial) {
            const error = new Error('Could not find RawMaterial.');
            error.statusCode = 404;
            throw error;
        }


        oldRawMaterial.name = newRawMaterial.name;
        oldRawMaterial.stock = newRawMaterial.stock;
        oldRawMaterial.stockEntity = newRawMaterial.stockEntity;



        const result = await oldRawMaterial.save();

        res.status(200).json({ message: 'Raw Material updated!', rawMaterial: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteRawMaterial = async (req, res, next) => {
    const rawMaterialId = req.params.rawMaterialId;
    try {
        const rawMaterial = await RawMaterial.findById(rawMaterialId);

        if (!rawMaterial) {
            const error = new Error('Could not find Raw Material.');
            error.statusCode = 404;
            throw error;
        }


        await RawMaterial.findByIdAndRemove(rawMaterialId);

        res.status(200).json({ message: 'Deleted RawMaterial.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};