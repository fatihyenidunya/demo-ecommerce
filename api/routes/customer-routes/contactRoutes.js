const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../../controllers/customer-controllers/contactController');


router.post('/contact', contactController.postMessage);


module.exports = router;

