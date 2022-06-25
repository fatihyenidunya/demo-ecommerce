const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const chatController = require('../controllers/chatController');
const isAuth = require('../middleware/is-auth');

router.get('/list', chatController.getChats);
router.get('/dashboard-list',isAuth, chatController.getDashboardChats);
router.get('/list/:chatId', chatController.getChat);
router.post('/new', chatController.postAddChat);
router.put('/update/:chatId', chatController.putUpdateChat);
router.delete('/delete/:chatId', chatController.deleteChat);
module.exports = router;