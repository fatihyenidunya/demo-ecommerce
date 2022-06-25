const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const dashboardController = require('../controllers/dashboardController');

const isAuth = require('../middleware/is-auth');

router.get('/getproductstock', isAuth, dashboardController.getProducts);
router.get('/getcheckproductstock', isAuth, dashboardController.getCheckProductStock);

module.exports = router;