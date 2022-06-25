const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const notificationEmailController = require('../controllers/notificationEmailController');

router.get('/list', notificationEmailController.getNotificationEmails);
router.get('/list/:emailId', notificationEmailController.getNotificationEmail);
router.get('/whatFor/:whatFor', notificationEmailController.getNotificationEmailWhatFor);
router.post('/new', notificationEmailController.postAddNotificationEmail);
router.put('/update/:emailId', notificationEmailController.putUpdateNotificationEmail);
router.delete('/delete/:emailId', notificationEmailController.deleteNotificationEmail);
module.exports = router;