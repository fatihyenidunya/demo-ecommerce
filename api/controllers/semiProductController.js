const mongodb = require('mongodb');
const SemiProduct = require('../models/semiProduct');
const SemiProductStockLog = require('../models/semiProductStockLog');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getSemiProducts = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await SemiProduct.find().countDocuments();
        const semiProducts = await SemiProduct.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched SemiProducts succesfully',
            semiProducts: semiProducts,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}



exports.getSemiProductStockLog = async (req, res, next) => {



    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const semiProductId = req.query.semiproductid;
    const perPage = Number(pageSize);


    try {

        const totalLog = await SemiProductStockLog.find({ semiProductId: semiProductId }).countDocuments();
        const semiProductStockLog = await SemiProductStockLog.find({ semiProductId: semiProductId }).skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });


        res.status(200).json({
            message: 'Fetched SemiProductStockLog succesfully',
            semiProductStockLog: semiProductStockLog,
            totalLog: totalLog

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.getFindSemiProducts = async (req, res, next) => {


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
      const totalSemiProduct = await SemiProduct.find(query).countDocuments();
      const semiProducts = await SemiProduct.find(query)
        .skip((currentPage - 1) * perPage)
        .limit(perPage).sort({ order: 1 });

        console.log(semiProducts)
  
  
      res.status(200).json({
        message: 'Fetched products succesfully',
        semiProducts: semiProducts,
        totalSemiProduct: totalSemiProduct
      })
  
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  
  }

  exports.postUpdateSemiProductStock = async (req, res, next) => {

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

        const semiProductId = ObjectId(req.body.productId);

        const semiProduct = await SemiProduct.findById(semiProductId);

        console.log(req.body.semiProductId);

        let semiProductStockLog = new SemiProductStockLog();

        semiProductStockLog.previousStock = semiProduct.stock;
        semiProductStockLog.material = semiProduct.name;
        semiProductStockLog.userName = req.body.userName;
        semiProductStockLog.operation = req.body.operation;
        semiProductStockLog.stockNote = req.body.stockNote;
        semiProductStockLog.semiProductId = semiProductId;
        semiProductStockLog.number = Number(req.body.number);

        if (req.body.operation === "add") {
            semiProduct.stock += Number(req.body.number);

            semiProductStockLog.lastStock = semiProduct.stock;
            await semiProductStockLog.save();
        } else {

            console.log(' çıkarmalı')

            semiProduct.stock -= Number(req.body.number);
            semiProductStockLog.lastStock = semiProduct.stock;
            await semiProductStockLog.save();

        }

        if (semiProduct.stock >= 0) {
            const result = await semiProduct.save();
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

exports.getSemiProduct = (req, res, next) => {
    const semiProductId = req.params.semiProductId
    

    SemiProduct
        .findById(semiProductId)
        .then(semiProduct => {

            if (!semiProduct) {

                const error = new Error('Could not find SemiProduct');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'SemiProduct fetched.', semiProduct: semiProduct })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddSemiProduct = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const semiProduct = new SemiProduct({
            name: req.body.name,
            stock: req.body.stock ,
            stockEntity: req.body.stockEntity   
        });
        const result = await semiProduct.save();
        res.status(201).json({ statusCode: 201, message: 'Raw Material created!', semiProductId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateSemiProduct = async (req, res, next) => {
    const semiProductId = req.params.semiProductId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newSemiProduct = new SemiProduct({
        name: req.body.name,
        stock: req.body.stock ,
        stockEntity: req.body.stockEntity   
        
    });


    try {
        const oldSemiProduct = await (await SemiProduct.findById(semiProductId));
        if (!oldSemiProduct) {
            const error = new Error('Could not find SemiProduct.');
            error.statusCode = 404;
            throw error;
        }


        oldSemiProduct.name = newSemiProduct.name;
        oldSemiProduct.stock = newSemiProduct.stock;
        oldSemiProduct.stockEntity = newSemiProduct.stockEntity;



        const result = await oldSemiProduct.save();

        res.status(200).json({ message: 'SemiProduct updated!', semiProduct: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteSemiProduct = async (req, res, next) => {
    const semiProductId = req.params.semiProductId;
    try {
        const semiProduct = await SemiProduct.findById(semiProductId);

        if (!semiProduct) {
            const error = new Error('Could not find SemiProduct.');
            error.statusCode = 404;
            throw error;
        }


        await SemiProduct.findByIdAndRemove(semiProductId);

        res.status(200).json({ message: 'Deleted SemiProduct.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};