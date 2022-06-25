const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const mailController = require('../controllers/emailController');
const isAuth = require('../middleware/is-auth');

router.post('/send', mailController.sendMail);
router.get('/list',isAuth, mailController.getEmails);
router.get('/list/:emailId',isAuth, mailController.getEmail);
router.post('/sendPdf',isAuth, mailController.sendPdf);
router.post('/new',isAuth, mailController.postAddEmail);
router.put('/update/:emailId',isAuth, mailController.putUpdateEmail);
router.delete('/delete/:emailId',isAuth, mailController.deleteEmail);


module.exports = router;