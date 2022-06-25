const mongodb = require('mongodb');
const Blog = require('../models/blog');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;
const errorService = require('../classes/errorService');

exports.getBlogs = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);

    try {
        const totalBlog = await Blog.find().countDocuments();
        const blogs = await Blog.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            blogs: blogs,
            totalBlog: totalBlog
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('blogController', 'getBlogs',10, 500, err);
        next(err);
    }

}

exports.getBlogList = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const title = req.query.title || '';
    const perPage = Number(pageSize);



    let titleTxt = '';

    let queryTxt = '';
    if (title != '') {
        if (title != 'undefined') {
            titleTxt = '"title":{ "\$regex" : "' + title + '", "\$options" : "i"}';
        }
    }
 

    queryTxt = '{' + titleTxt  + '}';

    


    let query = JSON.parse(queryTxt);

    

    try {
        const totalItems = await Blog.find(query).countDocuments();


        const blogs = await Blog.find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched blogs succesfully',
            blogs: blogs,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('blogController', 'getBlogList',39, 500, err);
        next(err);
    }

}

exports.getMainPageBlogs = async (req, res, next) => {

    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(3);


        res.status(200).json({
            message: 'Fetched succesfully',
            blogs: blogs

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('blogController', 'getMainPageBlogs',92, 500, err);
        next(err);
    }

}

exports.getBlog = (req, res, next) => {
    const blogId = req.params.blogId


    Blog
        .findById(blogId)
        .then(blog => {

            if (!blog) {

                const error = new Error('Could not find blog');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Slider fetched.', blog: blog })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('blogController', 'getBlog',116, 500, err);
            next(err);

        });

}

exports.postAddBlog = async (req, res, next) => {

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


        const blog = new Blog({
            imageUrl: imageUrl,
            title: req.body.title,
            metaDescription: req.body.metaDescription,
            titleLower: req.body.title.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-'),
            summary: req.body.summary,
            description: req.body.description,
            order: req.body.order,
            writer: req.body.writer,
            mainPage: req.body.mainPage,
            publish: req.body.publish

        });
        const result = await blog.save();
        res.status(201).json({ statusCode: 201, message: 'Product created!', blogId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('blogController', 'postAddBlog',147, 500, err);
        next(err);
    }
}



exports.putUpdateBlog = async (req, res, next) => {
    const blogId = req.params.blogId;
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




    const newBlog = new Blog({
        title: req.body.title,
        metaDescription: req.body.metaDescription,
        titleLower: req.body.title.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-'),
        summary: req.body.summary,
        order: req.body.order,
        description: req.body.description,
        writer: req.body.writer,
        publish: req.body.publish,
        mainPage: req.body.mainPage,
        imageUrl: imageUrl
    });




    try {
        const oldBlog = await (await Blog.findById(blogId));
        if (!oldBlog) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldBlog.title = newBlog.title;
        oldBlog.metaDescription = newBlog.metaDescription;
        oldBlog.titleLower = newBlog.titleLower;
        oldBlog.description = newBlog.description;
        oldBlog.summary = newBlog.summary;
        oldBlog.imageUrl=newBlog.imageUrl;      
        oldBlog.order = newBlog.order;
        oldBlog.mainPage = newBlog.mainPage;
        oldBlog.publish = newBlog.publish;
        oldBlog.writer = newBlog.writer;


        const result = await oldBlog.save();

        res.status(200).json({ message: 'Blog updated!', blog: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('blogController', 'putUpdateBlog',197, 500, err);
        next(err);
    }
};



exports.deleteBlog = async (req, res, next) => {
    const blogId = req.params.blogId;
    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            const error = new Error('Could not find blog.');
            error.statusCode = 404;
            throw error;
        }


        await Blog.findByIdAndRemove(blogId);

        res.status(200).json({ message: 'Deleted blog.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('blogController', 'deleteBlog',271, 500, err);
        next(err);
    }
};