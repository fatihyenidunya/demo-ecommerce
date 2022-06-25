const mongodb = require('mongodb');
const ProductCard = require('../models/productCard');
const RawMaterial = require('../models/rawMaterial');
const SemiProduct = require('../models/semiProduct');
const ProductCardRawMaterial = require('../models/productCardRawMaterial');
const ProductCardSemiProduct = require('../models/productCardSemiProduct');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const { raw } = require('express');

const ObjectId = mongodb.ObjectId;



exports.getProductCardList = async (req, res, next) => {




    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const name = req.query.name || '';
    const company = req.query.company || '';
    const perPage = Number(pageSize);




    let nameTxt = '';
    let companyTxt = '';
    if (name != '') {
        if (name != 'undefined') {
            nameTxt = '"name":{ "\$regex" : "' + name + '", "\$options" : "i"}}';
        }
    }


    if (company != 'Hepsi') {
        if (company != 'undefined') {
            if (company != '') {
                companyTxt = '"productCardCompany":"' + company + '",';

            }

        }
    }



    let queryText = companyTxt + nameTxt;

    queryText = queryText.substring(0, queryText.length - 1);


    queryTxt = '{' + queryText + '}';




    let query = JSON.parse(queryTxt);


    try {
        const totalItems = await ProductCard.find(query).countDocuments();
        const productCards = await ProductCard.find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Fetched products succesfully',
            productCards: productCards,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getProductCards = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await ProductCard.find().countDocuments();
        const productCards = await ProductCard.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched ProductCard succesfully',
            productCards: productCards,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getProductCard = (req, res, next) => {
    const productCardId = req.params.productCardId



    ProductCard
        .findById(productCardId)
        .then(productCard => {

            if (!productCard) {

                const error = new Error('Could not find ProductCard');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'ProductCard fetched.', productCard: productCard })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddProductCard = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {



        const productCard = new ProductCard({
            name: req.body.name,
            productId: req.body.productId,
            product: req.body.product,
            productCompany: req.body.productCompany,
            productCardCompany: req.body.productCardCompany,
            volume: req.body.volume,
            volumeEntity: req.body.volumeEntity,
            productCardVolume: req.body.productCardVolume,
            productCardVolumeEntity: req.body.productCardVolumeEntity

        });

        const result = await productCard.save();
        res.status(201).json({ statusCode: 201, message: 'ProductCard created!', productCardId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateProductCard = async (req, res, next) => {
    const productCardId = req.params.productCardId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    // const semiProduct = JSON.parse(req.body.semiProduct);
    // const rawMaterial = JSON.parse(req.body.rawMaterial);

    const newProductCard = new ProductCard({
        name: req.body.name,
        productId: req.body.productId,
        product: req.body.product,
        productCompany: req.body.productCompany,
        productCardCompany: req.body.productCardCompany,
        volume: req.body.volume,
        volumeEntity: req.body.volumeEntity,
        productCardVolume: req.body.productCardVolume,
        productCardVolumeEntity: req.body.productCardVolumeEntity


    });


    try {
        const oldProductCard = await (await ProductCard.findById(productCardId));
        if (!oldProductCard) {
            const error = new Error('Could not find ProductCard.');
            error.statusCode = 404;
            throw error;
        }

        oldProductCard.name = newProductCard.name;
        oldProductCard.productId = newProductCard.productId;
        oldProductCard.product = newProductCard.product;
        oldProductCard.productCompany = newProductCard.productCompany;
        oldProductCard.productCardCompany = newProductCard.productCardCompany;
        oldProductCard.volume = newProductCard.volume;
        oldProductCard.volumeEntity = newProductCard.volumeEntity;
        oldProductCard.productCardVolume = newProductCard.productCardVolume;
        oldProductCard.productCardVolumeEntity = newProductCard.productCardVolumeEntity;
        oldProductCard.image = newProductCard.image;
        oldProductCard.rawMaterial = newProductCard.rawMaterial;
        oldProductCard.semiProduct = newProductCard.semiProduct;




        const result = await oldProductCard.save();

        res.status(200).json({ message: 'ProductCard updated!', productCard: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteProductCard = async (req, res, next) => {
    const productCardId = req.params.productCardId;
    try {
        const productCard = await ProductCard.findById(productCardId);

        if (!productCard) {
            const error = new Error('Could not find ProductCard.');
            error.statusCode = 404;
            throw error;
        }


        await ProductCard.findByIdAndRemove(productCardId);

        res.status(200).json({ message: 'Deleted Product Card.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



exports.postAddProductCardRawMaterial = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {



        const productCardRawMaterial = new ProductCardRawMaterial({
            productCardId: req.body.productCardId,
            rawMaterialId: req.body.rawMaterialId,
            rawMaterial: req.body.rawMaterial,
            lotNo: req.body.lotNo,
            amount: req.body.amount,
            amountEntity: req.body.amountEntity,
            percentage: req.body.percentage,
            amountOfWhat: req.body.amountOfWhat,
            amountOfWhatEntity: req.body.amountOfWhatEntity,
            process: req.body.process

        });

        const result = await productCardRawMaterial.save();
        res.status(201).json({ statusCode: 201, message: 'ProductCardRawMaterial saved!' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getProductCardRawMaterials = async (req, res, next) => {


    const productCardId = req.params.productCardId

    try {

        const productCardRawMaterials = await ProductCardRawMaterial.find({ productCardId: productCardId });


        for (let raw of productCardRawMaterials) {

            const _raw = await RawMaterial.findById(raw.rawMaterialId);
        
            raw.stock = _raw.stock;

  
        }

        res.status(200).json({
            message: 'Fetched productCardRawMaterials succesfully',
            productCardRawMaterials: productCardRawMaterials

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.deleteProductCardRawMaterial = async (req, res, next) => {
    const productCardId = req.params.productCardId;
    const _id = req.params.id;
    try {
        const productCardRawMaterial = await ProductCardRawMaterial.find({ productCardId: productCardId, _id: _id });

        if (!productCardRawMaterial) {
            const error = new Error('Could not find ProductCard.');
            error.statusCode = 404;
            throw error;
        }
        await ProductCardRawMaterial.findOneAndRemove({ productCardId: productCardId, _id: _id });

        res.status(200).json({ message: 'Deleted ProductCardRawMaterial.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.postAddProductCardSemiProduct = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {



        const productCardSemiProduct = new ProductCardSemiProduct({
            productCardId: req.body.productCardId,
            semiProductId: req.body.semiProductId,
            semiProduct: req.body.semiProduct,
            lotNo: req.body.lotNo,
            amount: req.body.amount,
            amountEntity: req.body.amountEntity,
            // percentage: req.body.percentage,
            amountOfWhat: req.body.amountOfWhat,
            amountOfWhatEntity: req.body.amountOfWhatEntity,
            // process: req.body.process

        });

        const result = await productCardSemiProduct.save();
        res.status(201).json({ statusCode: 201, message: 'ProductCardRawMaterial saved!' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getProductCardSemiProducts = async (req, res, next) => {


    const productCardId = req.params.productCardId

    try {

        const productCardSemiProducts = await ProductCardSemiProduct.find({ productCardId: productCardId });


        for (let semi of productCardSemiProducts) {

            const _semi = await SemiProduct.findById(semi.semiProductId);

        
            semi.stock = _semi.stock;

  
        }

        console.log('-------------------------')
        console.log(productCardSemiProducts);

        res.status(200).json({
            message: 'Fetched productCardSemiProducts succesfully',
            productCardSemiProducts: productCardSemiProducts

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.deleteProductCardSemiProduct = async (req, res, next) => {
    const productCardId = req.params.productCardId;
    const _id = req.params.id;


    try {
        const productCardSemiProduct = await ProductCardSemiProduct.find({ productCardId: productCardId, _id: _id });

        if (!productCardSemiProduct) {
            const error = new Error('Could not find ProductCard.');
            error.statusCode = 404;
            throw error;
        }
        await ProductCardSemiProduct.findOneAndRemove({ productCardId: productCardId, _id: _id });

        res.status(200).json({ message: 'Deleted ProductCardSemiProduct.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.productCardCopy = async (req, res, next) => {
    const productCardId = req.params.productCardId;
    const company = req.body.newCompany;
    const productCardName = req.body.newProductCardName;


    console.log('-----copy--------')

    console.log(company);
    console.log(productCardName);


    try {

        const oldProductCard = await (await ProductCard.findById(productCardId));
        if (!oldProductCard) {
            const error = new Error('Could not find ProductCard.');
            error.statusCode = 404;
            throw error;
        }

        oldProductCard.name = productCardName;
        oldProductCard.productCardCompany = company


        const newProductCard = new ProductCard({
            name: oldProductCard.name,
            productId: oldProductCard.productId,
            product: oldProductCard.product,
            productCompany: oldProductCard.productCompany,
            productCardCompany: oldProductCard.productCardCompany,
            volume: oldProductCard.volume,
            volumeEntity: oldProductCard.volumeEntity,
            productCardVolume: oldProductCard.productCardVolume,
            productCardVolumeEntity: oldProductCard.productCardVolumeEntity

        });

        const newCard = await newProductCard.save();


        const productCardRawMaterials = await ProductCardRawMaterial.find({ productCardId: productCardId });
        const productCardSemiProducts = await ProductCardSemiProduct.find({ productCardId: productCardId });


        for (let raw of productCardRawMaterials) {

            let rawMaterial = new ProductCardRawMaterial({
                productCardId: newCard._id,
                rawMaterialId: raw._id,
                rawMaterial: raw.rawMaterial,
                lotNo: raw.lotNo,
                amount: raw.amount,
                amountEntity: raw.amountEntity,
                percentage: raw.percentage,
                amountOfWhat: raw.amountOfWhat,
                amountOfWhatEntity: raw.amountOfWhatEntity,
                process: raw.process

            });

            let ty = await rawMaterial.save();
        }

        for (let semi of productCardSemiProducts) {

            let semiProduct = new ProductCardSemiProduct({
                productCardId: newCard._id,
                rawMaterialId: semi._id,
                rawMaterial: semi.semiProduct,
                lotNo: semi.lotNo,
                amount: semi.amount,
                amountEntity: semi.amountEntity,
                percentage: semi.percentage,
                amountOfWhat: semi.amountOfWhat,
                amountOfWhatEntity: semi.amountOfWhatEntity,
                process: semi.process

            });

            let ty = await semiProduct.save();
        }





        res.status(200).json({ message: 'ProductCard copied!', productCard: newCard, copy: true });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};