const express = require('express');
const router = express.Router();

const blogController = require('../../controllers/customer-controllers/blogController');

router.get('/list/:page/:pageSize', blogController.getBlogs);
router.get('/list/:blogId', blogController.getBlog);

module.exports = router;