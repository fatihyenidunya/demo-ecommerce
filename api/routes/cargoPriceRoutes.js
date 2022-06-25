const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cargoPriceController = require('../controllers/cargoPriceController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, cargoPriceController.getCargoPrices);
router.get('/list/:cargoPriceId',isAuth, cargoPriceController.getCargoPrice);
router.post('/new',isAuth, cargoPriceController.postAddCargoPrice);
router.put('/update/:cargoPriceId',isAuth, cargoPriceController.putUpdateCargoPrice);
router.delete('/delete/:cargoPriceId',isAuth, cargoPriceController.deleteCargoPrice);
router.post('/postCheckCargoPrice', cargoPriceController.postCheckCargoPrice);

module.exports = router;