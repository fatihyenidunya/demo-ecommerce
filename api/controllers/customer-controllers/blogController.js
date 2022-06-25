const mongodb = require('mongodb');
const Blog = require('../../models/blog');
const { validationResult } = require('express-validator/check');
const errorService = require('../../classes/errorService');


const ObjectId = mongodb.ObjectId;

exports.getBlogs = async (req, res, next) => {


    const currentPage = req.params.page || 1;
    const pageSize = req.params.pagesize;
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
        errorService.sendErrorNotificationViaEmail('blogController','getBlogs',9,500,err);
      
     
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

            res.status(200).json({ message: 'blog fetched.', blog: blog })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('blogController','getBlog',42,500,err);
      
            next(err);

        });

}





