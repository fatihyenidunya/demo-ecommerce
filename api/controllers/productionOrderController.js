const mongodb = require('mongodb');
const Product = require('../models/product');
const ProductionOrder = require('../models/productionOrder');
const ProductStockLog = require('../models/productStockLog');
const RawMaterialStockLog = require('../models/rawMaterialStockLog');
const SemiProductStockLog = require('../models/semiProductStockLog');

const RawMaterial = require('../models/rawMaterial');
const SemiProduct = require('../models/semiProduct');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getProductionOrders = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await ProductionOrder.find().countDocuments();
        const productionOrders = await ProductionOrder.find()
            .skip((currentPage - 1) * perPage).sort({ createdAt: -1 })
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched ProductCard succesfully',
            productionOrders: productionOrders,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getCompanyProductionOrder = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const company = req.query.company;
    const perPage = req.query.pageSize;
    let totalRecord;


    try {
        const totalRecord = await ProductionOrder.find({ company: company }).countDocuments();
        const productionOrders = await ProductionOrder.find({ company: company })
            .skip((currentPage - 1) * perPage).sort({ createdAt: -1 })
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched ProductCard succesfully',
            productionOrders: productionOrders,
            totalRecord: totalRecord
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getProductionOrder = (req, res, next) => {
    const productionOrderId = req.params.productionOrderId


    ProductionOrder
        .findById(productionOrderId)
        .then(productionOrder => {

            if (!productionOrder) {

                const error = new Error('Could not find Production Order');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Production Order fetched.', productionOrder: productionOrder })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddProductionOrder = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        let attentionNote = req.body.attentionNote;
        if (attentionNote === 'undefined') {
            attentionNote = '';
        }

        let controlConclusion = req.body.controlConclusion;
        if (controlConclusion === 'undefined') {
            controlConclusion = '';
        }

        let lotNo = req.body.lotNo;
        if (lotNo === 'undefined') {
            lotNo = '';
        }

        let note = req.body.note;
        if (note === 'undefined') {
            note = '';
        }

        let paint = req.body.paint;

        if (paint === 'undefined') {
            paint = '';
        }

        const semiProducts = JSON.parse(req.body.semiProducts);
        const rawMaterials = JSON.parse(req.body.rawMaterials);


        const productionOrder = new ProductionOrder({
            company: req.body.company,
            productCardId: req.body.productCardId,
            productCard: req.body.productCard,
            productCardCompany: req.body.productCardCompany,
            productCardVolume: req.body.productCardVolume,
            productCardVolumeEntity: req.body.productCardVolumeEntity,
            productId: req.body.productId,
            volume: req.body.volume,
            volumeEntity: req.body.volumeEntity,
            productionDate: Date(req.body.productionDate),
            lastUsageDate: Date(req.body.lastUsageDate),
            lotNo: lotNo,
            productionVolume: req.body.productionVolume,
            productionVolumeEntity: req.body.productionVolumeEntity,
            rawMaterials: rawMaterials,
            semiProducts: semiProducts,
            attentionNote: attentionNote,
            controlConclusion: controlConclusion,
            paint: paint,
            producerPerson: req.body.producerPerson,
            researcherOfficer: req.body.researcherOfficer,
            qualityOfficer: req.body.qualityOfficer,
            producerOfficer: req.body.producerOfficer,
            note: note,
            status: req.body.status

        });

        const result = await productionOrder.save();
        res.status(201).json({ statusCode: 201, message: 'productionOrder created!', productionOrderId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateProductionOrder = async (req, res, next) => {
    const productionOrderId = req.params.productionOrderId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const semiProducts = JSON.parse(req.body.semiProducts);
    const rawMaterials = JSON.parse(req.body.rawMaterials);


    let attentionNote = req.body.attentionNote;
    if (attentionNote === 'undefined') {
        attentionNote = '';
    }

    let controlConclusion = req.body.controlConclusion;
    if (controlConclusion === 'undefined') {
        controlConclusion = '';
    }

    let lotNo = req.body.lotNo;
    if (lotNo === 'undefined') {
        lotNo = '';
    }

    let note = req.body.note;
    if (note === 'undefined') {
        note = '';
    }

    let paint = req.body.paint;

    if (paint === 'undefined') {
        paint = '';
    }


    const newProductionOrder = new ProductionOrder({

        company: req.body.company,
        productCardId: req.body.productCardId,
        productCard: req.body.productCard,
        productCardCompany: req.body.productCardCompany,
        productCardVolume: req.body.productCardVolume,
        productCardVolumeEntity: req.body.productCardVolumeEntity,
        productId: req.body.productId,
        volume: req.body.volume,
        volumeEntity: req.body.volumeEntity,
        productionDate: Date(req.body.productionDate),
        lastUsageDate: Date(req.body.lastUsageDate),
        lotNo: lotNo,
        productionVolume: req.body.productionVolume,
        productionVolumeEntity: req.body.productionVolumeEntity,
        rawMaterials: rawMaterials,
        semiProducts: semiProducts,
        attentionNote: attentionNote,
        controlConclusion: controlConclusion,
        paint: paint,
        producerPerson: req.body.producerPerson,
        researcherOfficer: req.body.researcherOfficer,
        qualityOfficer: req.body.qualityOfficer,
        producerOfficer: req.body.producerOfficer,
        note: note,
        status: req.body.status

    });


    try {
        const oldProductionOrder = await (await ProductionOrder.findById(productionOrderId));
        if (!oldProductionOrder) {
            const error = new Error('Could not find ProductionOrder.');
            error.statusCode = 404;
            throw error;
        }


        oldProductionOrder.company = newProductionOrder.company;
        oldProductionOrder.productCardId = newProductionOrder.productCardId;
        oldProductionOrder.productId = newProductionOrder.productId;
        oldProductionOrder.productCard = newProductionOrder.productCard;
        oldProductionOrder.productCardCompany = newProductionOrder.productCardCompany;
        oldProductionOrder.productCardVolume = newProductionOrder.productCardVolume;
        oldProductionOrder.productCardVolumeEntity = newProductionOrder.productCardVolumeEntity;
        oldProductionOrder.volume = newProductionOrder.volume;
        oldProductionOrder.volumeEntity = newProductionOrder.volumeEntity;
        oldProductionOrder.productionDate = newProductionOrder.productionDate;
        oldProductionOrder.lastUsageDate = newProductionOrder.lastUsageDate;
        oldProductionOrder.lotNo = newProductionOrder.lotNo;
        oldProductionOrder.productionVolume = newProductionOrder.productionVolume;
        oldProductionOrder.productionVolumeEntity = newProductionOrder.productionVolumeEntity;
        oldProductionOrder.rawMaterials = newProductionOrder.rawMaterials;
        oldProductionOrder.semiProducts = newProductionOrder.semiProducts;
        oldProductionOrder.attentionNote = newProductionOrder.attentionNote;
        oldProductionOrder.controlConclusion = newProductionOrder.controlConclusion;
        oldProductionOrder.paint = newProductionOrder.paint;
        oldProductionOrder.producerPerson = newProductionOrder.producerPerson;
        oldProductionOrder.researcherOfficer = newProductionOrder.researcherOfficer;
        oldProductionOrder.qualityOfficer = newProductionOrder.qualityOfficer;
        oldProductionOrder.producerOfficer = newProductionOrder.producerOfficer;
        oldProductionOrder.note = newProductionOrder.note;
        oldProductionOrder.status = newProductionOrder.status;

        const result = await oldProductionOrder.save();

        res.status(200).json({ message: 'Production Order updated!', productionOrder: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.putFinishProductionOrder = async (req, res, next) => {
    const productionOrderId = req.params.productionOrderId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }






    try {
        const oldProductionOrder = await (await ProductionOrder.findById(productionOrderId));
        if (!oldProductionOrder) {
            const error = new Error('Could not find ProductionOrder.');
            error.statusCode = 404;
            throw error;
        }

        oldProductionOrder.status = req.body.status;
        oldProductionOrder.productBoxProduced = req.body.productBoxProduced;
        oldProductionOrder.wasteNumber = req.body.wasteNumber;
        oldProductionOrder.note = oldProductionOrder.note + '  Warehouse Note : ' + req.body.note;
        const result = await oldProductionOrder.save();


        const productId = req.body.productId;

        const semiProducts = JSON.parse(req.body.semiProducts);
        const rawMaterials = JSON.parse(req.body.rawMaterials);


        if (req.body.productionCompany === 'Nishman') {

            const product = await Product.findById(productId);


            producedProductNumber = Number(product.quantityInBox) * Number(req.body.productBoxProduced);

            const prevStock = product.stock;
            product.stock += producedProductNumber;
            product.virtualStock += producedProductNumber;

            const re = await product.save();

            const productStockLog = new ProductStockLog({
                quantityInBox: product.quantityInBox,
                productId: productId,
                title: product.title,
                previousStock: prevStock,
                operation: 'Production Added',
                number: producedProductNumber,
                lastStock: product.stock,
                userName: req.body.userName

            });
            const rest = await productStockLog.save();



            for (let raw of rawMaterials) {

                const _rawMaterial = await RawMaterial.findById(raw.rawMaterialId);

                const rawPrevStock = _rawMaterial.stock;
                _rawMaterial.stock -= raw.totalAmount;

                const _ret = await _rawMaterial.save();

                let rawMaterialStockLog = new RawMaterialStockLog();

                rawMaterialStockLog.previousStock = rawPrevStock;
                rawMaterialStockLog.lastStock = _rawMaterial.stock;
                rawMaterialStockLog.material = _rawMaterial.name;
                rawMaterialStockLog.userName = req.body.userName;
                rawMaterialStockLog.operation = 'Production Subtracted';
                rawMaterialStockLog.stockNote = oldProductionOrder.note;
                rawMaterialStockLog.rawMaterialId = raw.rawMaterialId;
                rawMaterialStockLog.number = Number(raw.totalAmount);

                const _raww = await rawMaterialStockLog.save();


            }

            for (let semi of semiProducts) {

                const _semiProduct = await SemiProduct.findById(semi.semiProductId);
                const semiPrevStock = _semiProduct.stock;
                _semiProduct.stock -= semi.amount;

                const _ret = await _semiProduct.save();


                let semiProductStockLog = new SemiProductStockLog();

                semiProductStockLog.previousStock = semiPrevStock;
                semiProductStockLog.lastStock = _semiProduct.stock;
                semiProductStockLog.material = _semiProduct.name;
                semiProductStockLog.userName = req.body.userName;
                semiProductStockLog.operation = 'Production Subtracted';
                semiProductStockLog.stockNote = oldProductionOrder.note;
                semiProductStockLog.semiProductId = semi.semiProductId;
                semiProductStockLog.number = Number(semi.amount);

                const semm = await semiProductStockLog.save();

            }

        }

        res.status(200).json({ message: 'Production Order finished!', productionOrder: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.getFindProductionOrder = async (req, res, next) => {




    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const company = req.query.company;
    const lotNo = req.query.lotNo;



    let totalItems = 40;


    let perPage = Number(pageSize);


    let queryTxt = "";
    let lotNoTxt = "";
    let companyTxt = "";





    if (company != 'Hepsi') {
        if (company != 'undefined') {
            companyTxt = '"company":"' + company + '",';

        }
    }

    if (lotNo != '') {
        if (lotNo != 'undefined') {
            lotNoTxt = '"lotNo":"' + lotNo + '",';

        }
    }


    let queryText = companyTxt + lotNoTxt;

    queryText = queryText.substring(0, queryText.length - 1);


    queryTxt = '{' + queryText + '}';

    let query = JSON.parse(queryTxt);

    try {
        const items = await ProductionOrder.find(query).countDocuments();

        const productionOrders = await ProductionOrder
            .find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            productionOrders: productionOrders,
            totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.putCanceledProductionOrder = async (req, res, next) => {
    const productionOrderId = req.params.productionOrderId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }



    const newProductionOrder = new ProductionOrder({
        status: req.body.status
    });


    try {
        const oldProductionOrder = await (await ProductionOrder.findById(productionOrderId));
        if (!oldProductionOrder) {
            const error = new Error('Could not find ProductionOrder.');
            error.statusCode = 404;
            throw error;
        }

        oldProductionOrder.status = newProductionOrder.status;

        const result = await oldProductionOrder.save();

        res.status(200).json({ message: 'Production Order canceled!', productionOrder: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.deleteProductionOrder = async (req, res, next) => {
    const productionOrderId = req.params.productionOrderId;
    try {
        const productionOrder = await ProductionOrder.findById(productionOrderId);

        if (!productionOrder) {
            const error = new Error('Could not find productionOrder.');
            error.statusCode = 404;
            throw error;
        }


        await ProductionOrder.findByIdAndRemove(productionOrderId);

        res.status(200).json({ message: 'Deleted Product Card.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};