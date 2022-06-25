const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cargoCompanyController = require('../controllers/cargoCompanyController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, cargoCompanyController.getCargoCompanies);
router.get('/list/:cargoCompanyId',isAuth, cargoCompanyController.getCargoCompany);
router.post('/new',isAuth, cargoCompanyController.postAddCargoCompany);
router.put('/update/:cargoCompanyId',isAuth, cargoCompanyController.putUpdateCargoCompany);
router.delete('/delete/:cargoCompanyId',isAuth, cargoCompanyController.deleteCargoCompany);


module.exports = router;