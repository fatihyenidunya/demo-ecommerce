const mongodb = require('mongodb');
const Category = require('../models/category');
const { validationResult } = require('express-validator/check');
const Product = require('../models/product');
const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;



exports.getCategoriesForMenu = async (req, res, next) => {

    try {



        const categories = [];

        const _categories = await Category.find({ publish: true, isTopCategory: true });




        for (let _topCategory of _categories) {




            __category = { id: {}, name: {}, nameLower: {}, subCategories: [] }


            const subCategories = await Category.find({ topCategoryId: _topCategory._id });




            __category.id = _topCategory._id;
            __category.name = _topCategory.name;
            __category.nameLower = _topCategory.nameLower;
       
            __category.subCategories.push(subCategories);


            categories.push(__category);
        }

  

        res.status(200).json({
            message: 'Fetched categories succesfully',
            categories: categories

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'getCategoriesForMenu',11, 500, err);

        next(err);
    }

}

exports.getCategoriesForMenuForMobile = async (req, res, next) => {

    try {

        const categories = await Category.find({ isTopCategory: true, publish: true });

        res.status(200).json({
            message: 'Fetched categories succesfully',
            categories: categories

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'getCategoriesForMenuForMobile',66, 500, err);
        next(err);
    }

}


exports.getCategories = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await Category.find().countDocuments();
        const categories = await Category.find({ isTopCategory: true })
            .skip((currentPage - 1) * perPage)
            .sort({ name: 1 })
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched categories succesfully',
            categories: categories,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'getCategories',89, 500, err);
        next(err);
    }

}

exports.getMainpageCategories = async (req, res, next) => {



    const mainpageCategories = []



    try {

        const categories = await Category.find({ mainPage: true });


        for (let c of categories) {

            category = { category: {}, categoryNameLower: {}, products: [] }


            const prices = await Product.find({ mainPage: true, categoryNameLower: c.nameLower })
                .limit(4)
                .exec();



            category.products = prices;
            category.category = c.name;
            category.categoryNameLower = c.nameLower;


            mainpageCategories.push(category);



        }

        mainpageCategories[0].active = 'active';
        mainpageCategories[0].show = 'show';




        res.status(200).json({
            message: 'Fetched categories succesfully',
            categories: mainpageCategories,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'getMainpageCategories',119, 500, err);
        next(err);
    }

}

exports.getCategory = (req, res, next) => {
    const categoryId = req.params.categoryId


    Category
        .findById(categoryId)
        .then(category => {

            if (!category) {

                const error = new Error('Could not find category');
                err.statusCode = 404;
                throw error;
            }



            res.status(200).json({ message: 'Category fetched.', category: category })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('categoryController', 'getCategory',176, 500, err);

            next(err);

        });

}



exports.checkCategoryForProduct = async (req, res, next) => {
    const categoryId = req.params.categoryId

    let subCategories = [];
    let isTopCategory = false;
    let topCategory;
    try {

 


        const category = await Category.findById(categoryId);
        isTopCategory = category.isTopCategory;

        if (category.isTopCategory === false) {

            subCategories = await Category.find({ topCategoryId: category.topCategoryId });

            topCategory = await Category.findById(category.topCategoryId);

        }

        if (category.isTopCategory === false) {

            res.status(200).json({
                message: 'Fetched categories succesfully',
                subCategories: subCategories,
                category: category,
                isTopCategory: isTopCategory,
                topCategory: topCategory

            })

        }
        else {
            res.status(200).json({
                message: 'Fetched categories succesfully',
                category: category,
                isTopCategory: isTopCategory

            })

        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'checkCategoryForProduct',212, 500, err);
        next(err);
    }

}




exports.postAddCategory = async (req, res, next) => {



    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        let nameLower = req.body.name.toLowerCase();

        const category = new Category({
            name: req.body.name,
            nameLower: nameLower.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o'),
            turkishName: req.body.turkishName,
            isTopCategory: req.body.isTopCategory,
            topCategoryId: req.body.topCategoryId,
            topCategoryName: req.body.topCategoryName,
            title: req.body.name,
            publish: req.body.publish,
            mainPage: req.body.mainPage,
            metaDescription: req.body.name,
            topCategoryNameLower: req.body.topCategoryNameLower.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o'),

        });
        const result = await category.save();
        res.status(201).json({ statusCode: 201, message: 'Category created!', categoryId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'postAddCategory',269, 500, err);

        next(err);
    }
}


exports.putUpdateCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    let nameLower = req.body.name.toLowerCase();



    const newCategory = new Category({
        name: req.body.name,
        nameLower: nameLower.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o'),
        turkishName: req.body.turkishName,
        isTopCategory: req.body.isTopCategory,
        topCategoryId: req.body.topCategoryId,
        topCategoryName: req.body.topCategoryName,
        title: req.body.name,
        publish: req.body.publish,
        mainPage: req.body.mainPage,
        metaDescription: req.body.name,
        topCategoryNameLower: req.body.topCategoryNameLower.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o')

    });

    try {
        const oldCategory = await (await Category.findById(categoryId));
        if (!oldCategory) {
            const error = new Error('Could not find category.');
            error.statusCode = 404;
            throw error;
        }

        oldCategory.name = newCategory.name;
        oldCategory.nameLower = newCategory.nameLower;
        oldCategory.turkishName = newCategory.turkishName;
        oldCategory.isTopCategory = newCategory.isTopCategory;
        oldCategory.topCategoryId = newCategory.topCategoryId;
        oldCategory.topCategoryName = newCategory.topCategoryName;
        oldCategory.title = newCategory.title;
        oldCategory.publish = newCategory.publish;
        oldCategory.mainPage = newCategory.mainPage;
        oldCategory.metaDescription = newCategory.metaDescription;
        oldCategory.topCategoryNameLower = newCategory.topCategoryNameLower;



        const result = await oldCategory.save();

        res.status(200).json({ message: 'Category updated!', category: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'putUpdateCategory',313, 500, err);

        next(err);
    }
};


exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            const error = new Error('Could not find category.');
            error.statusCode = 404;
            throw error;
        }


        await Category.findByIdAndRemove(categoryId);

        res.status(200).json({ message: 'Deleted category.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'deleteCategory',376, 500, err);

        next(err);
    }
};


exports.getSubCategories = async (req, res, next) => {
    const topCategoryId = req.params.topCategoryId;

    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await Category.find({ topCategoryId: topCategoryId }).countDocuments();
        const categories = await Category.find({ topCategoryId: topCategoryId })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched categories succesfully',
            categories: categories,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('categoryController', 'getSubCategories',402, 500, err);

        next(err);
    }

}