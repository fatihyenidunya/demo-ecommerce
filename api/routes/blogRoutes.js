const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogController = require('../controllers/blogController');
const isAuth = require('../middleware/is-auth');

router.get('/list', blogController.getBlogs);
router.get('/bloglist', blogController.getBlogList);
router.get('/mainpage', blogController.getMainPageBlogs);
router.get('/list/:blogId', blogController.getBlog);
router.post('/new',isAuth, blogController.postAddBlog);
router.put('/update/:blogId',isAuth, blogController.putUpdateBlog);
router.delete('/delete/:blogId',isAuth, blogController.deleteBlog);
module.exports = router;