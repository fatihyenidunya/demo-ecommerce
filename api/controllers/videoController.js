const mongodb = require('mongodb');
const Video = require('../models/video');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getVideos = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);





    try {
        const totalVideo = await Video.find().countDocuments();
        const videos = await Video.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            videos: videos,
            totalVideo: totalVideo
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('videoController', 'getVideos', 9, 500, err);

        next(err);
    }

}


exports.getAllVideos = async (req, res, next) => {



    try {
        // const totalVideo = await Video.find().countDocuments();
        const medias = await Video.find();
            
   

        res.status(200).json({
            message: 'Fetched succesfully',
            medias: medias
      
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('videoController', 'getAllVideos', 44, 500, err);

        next(err);
    }

}


exports.getMainPageVideos = async (req, res, next) => {



    try {
    
        const videos = await Video.find()
            .sort({createAt: -1 })
            .limit(3);

        res.status(200).json({
            message: 'Fetched succesfully',
            videos: videos
           
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('videoController', 'getMainPageVideos', 72, 500, err);

        next(err);
    }

}

exports.getVideo = (req, res, next) => {
    const videoId = req.params.videoId


    Video
        .findById(videoId)
        .then(video => {

            if (!video) {

                const error = new Error('Could not find product');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'video fetched.', video: video })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('videoController', 'getVideo', 99, 500, err);

            next(err);

        });

}

exports.postAddVideo = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

       


        const video = new Video({
            videoUrl: req.body.videoUrl,
            title: req.body.title,            
            order: req.body.order,
            mainPage: req.body.mainPage,
            publish: req.body.publish
        });

        const result = await video.save();
        res.status(201).json({ statusCode: 201, message: 'Video created!', videoId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('videoController', 'postAddVideo', 131, 500, err);

        next(err);
    }
}



exports.putUpdateVideo = async (req, res, next) => {
    const videoId = req.params.videoId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }


 
    const newVideo = new Video({
        videoUrl: req.body.videoUrl,
        title: req.body.title,            
        order: req.body.order,
        mainPage: req.body.mainPage,
        publish: req.body.publish
    });

    try {
        const oldVideo = await (await Video.findById(videoId));
        if (!oldVideo) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldVideo.videoUrl = newVideo.videoUrl;
        oldVideo.title = newVideo.title;
        oldVideo.order = newVideo.order;
        oldVideo.mainPage = newVideo.mainPage;
        oldVideo.publish = newVideo.publish;



        const result = await oldVideo.save();

        res.status(200).json({ message: 'Video updated!', video: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('videoController', 'putUpdateVideo', 169, 500, err);

        next(err);
    }
};



exports.deleteVideo = async (req, res, next) => {
    const videoId = req.params.videoId;
    try {
        const video = await Video.findById(videoId);

        if (!video) {
            const error = new Error('Could not find slider.');
            error.statusCode = 404;
            throw error;
        }


        await Video.findByIdAndRemove(videoId);

        res.status(200).json({ message: 'Deleted video.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('videoController', 'deleteVideo', 220, 500, err);
        next(err);
    }
};