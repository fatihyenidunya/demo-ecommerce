const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, companyController.getCompanies);
router.get('/list/:companyId',isAuth, companyController.getCompany);
router.post('/new',isAuth, companyController.postAddCompany);
router.put('/update/:companyId',isAuth, companyController.putUpdateCompany);
router.delete('/delete/:companyId',isAuth, companyController.deleteCompany);


module.exports = router;