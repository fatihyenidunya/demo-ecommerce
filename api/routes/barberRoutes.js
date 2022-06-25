const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const barberController = require('../controllers/customer-controllers/individualCustomerController.js');


router.get('/list',isAuth, barberController.getBarbers);
router.get('/list/:barberId',isAuth, barberController.getBarber);
router.post('/new',isAuth, barberController.postAddBarber);
router.put('/update/:barberId',isAuth, barberController.putUpdateBarber);
router.delete('/delete/:barberId',isAuth, barberController.deleteBarber);
router.get('/getSendPricePdfToBarber/:barberId/:activate',isAuth, barberController.getSendPricePdfToBarber);

module.exports = router;