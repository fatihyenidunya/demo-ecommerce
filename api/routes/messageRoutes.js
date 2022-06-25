const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const isAuth = require('../middleware/is-auth');

router.get('/list', messageController.getMessages);
router.get('/dashboard-list',isAuth, messageController.getDashboardMessages);
router.get('/list/:messageId', messageController.getMessage);
router.post('/new', messageController.postAddMessage);
router.put('/update/:messageId', messageController.putUpdateMessage);
router.delete('/delete/:messageId', messageController.deleteMessage);
module.exports = router;