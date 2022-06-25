const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bankAccountController = require('../controllers/bankAccountController');
const isAuth = require('../middleware/is-auth');

router.get('/list', bankAccountController.getAccounts);
router.get('/list/:accountId', bankAccountController.getAccount);
router.post('/new',isAuth, bankAccountController.postAddAccount);
router.put('/update/:accountId',isAuth, bankAccountController.putUpdateAccount);
router.delete('/delete/:accountId',isAuth, bankAccountController.deleteAccount);
module.exports = router;