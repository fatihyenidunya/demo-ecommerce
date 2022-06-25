const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Category = require('../models/category');
const categoryController = require('../controllers/categoryController');
const isAuth = require('../middleware/is-auth');


router.get('/list',isAuth, categoryController.getCategories);
router.get('/getmainpagecategories', categoryController.getMainpageCategories);
router.get('/checkCategoryForProduct/:categoryId', categoryController.checkCategoryForProduct);
router.get('/categoriesformenu', categoryController.getCategoriesForMenu);
router.get('/categoriesformenuformobile', categoryController.getCategoriesForMenuForMobile);
router.get('/list/:categoryId',isAuth, categoryController.getCategory);
router.post('/new', categoryController.postAddCategory);
router.put('/update/:categoryId', categoryController.putUpdateCategory);
router.delete('/delete/:categoryId', categoryController.deleteCategory);
router.get('/getSubCategories/:topCategoryId', categoryController.getSubCategories);

module.exports = router;