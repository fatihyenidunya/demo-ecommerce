const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const transporterController = require('../controllers/transporterController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, transporterController.getTransporters);
router.get('/list/:transporterId',isAuth, transporterController.getTransporter);
router.post('/new',isAuth, transporterController.postAddTransporter);
router.put('/update/:transporterId',isAuth, transporterController.putUpdateTransporter);
router.delete('/delete/:transporterId',isAuth, transporterController.deleteTransporter);

module.exports = router;