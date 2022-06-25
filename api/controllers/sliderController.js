const mongodb = require('mongodb');
const Slider = require('../models/slider');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getSliders = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);





    try {
        const totalSlider = await Slider.find().countDocuments();
        const sliders = await Slider.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            sliders: sliders,
            totalSlider: totalSlider
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('sliderController', 'getSliders', 9, 500, err);

        next(err);
    }

}

exports.getSlider = (req, res, next) => {
    const sliderId = req.params.sliderId


    Slider
        .findById(sliderId)
        .then(slider => {

            if (!slider) {

                const error = new Error('Could not find product');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Slider fetched.', slider: slider })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('sliderController', 'getSlider', 43, 500, err);

            next(err);

        });

}

exports.postAddSlider = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        if (!req.file) {
            console.log(req.file);

            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path.replace("\\", "/");
        console.log(imageUrl)


        const slider = new Slider({
            imageUrl: imageUrl,
            title: req.body.title,
            description: req.body.description,
            order: req.body.order,
            link: req.body.link

        });
        const result = await slider.save();
        res.status(201).json({ statusCode: 201, message: 'Product created!', sliderId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('sliderController', 'postAddSlider', 75, 500, err);

        next(err);
    }
}



exports.putUpdateSlider = async (req, res, next) => {
    const sliderId = req.params.sliderId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }


    let imageUrl;

    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    } else {
        imageUrl = req.body.image;
    }




    console.log(imageUrl)

    const newSlider = new Slider({
        title: req.body.title,
        order: req.body.order,
        description: req.body.description,
        link: req.body.link,
        imageUrl: imageUrl

    });

    try {
        const oldSlider = await (await Slider.findById(sliderId));
        if (!oldSlider) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldSlider.title = newSlider.title;
        oldSlider.description = newSlider.description;
        oldSlider.imageUrl = newSlider.imageUrl;
        oldSlider.order = newSlider.order;
        oldSlider.link = newSlider.link;



        const result = await oldSlider.save();

        res.status(200).json({ message: 'Product updated!', slider: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('sliderController', 'putUpdateSlider', 121, 500, err);

        next(err);
    }
};



exports.deleteSlider = async (req, res, next) => {
    const sliderId = req.params.sliderId;
    try {
        const slider = await Slider.findById(sliderId);

        if (!slider) {
            const error = new Error('Could not find slider.');
            error.statusCode = 404;
            throw error;
        }


        await Slider.findByIdAndRemove(sliderId);

        res.status(200).json({ message: 'Deleted slider.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('sliderController', 'deleteSlider', 185, 500, err);

        next(err);
    }
};