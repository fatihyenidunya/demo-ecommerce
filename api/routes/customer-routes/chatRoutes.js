const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const chatController = require('../../controllers/customer-controllers/chatController');


router.post('/postMessage', chatController.postMessage);
router.get('/getmessages/:customerId', chatController.getMessages);


module.exports = router;