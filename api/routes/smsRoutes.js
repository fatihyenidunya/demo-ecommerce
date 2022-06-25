const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const smsController = require('../controllers/smsController');
const isAuth = require('../middleware/is-auth');

router.post('/newSms',isAuth, smsController.postAddSms);
router.get('/smsList',isAuth, smsController.getSmses);

router.get('/list',isAuth, smsController.getSmsSettings);
router.get('/list/:smsSettingId',isAuth, smsController.getSmsSetting);
router.post('/new',isAuth, smsController.postAddSmsSetting);
router.put('/update/:smsSettingId',isAuth, smsController.putUpdateSmsSetting);
router.delete('/delete/:smsSettingId',isAuth, smsController.deleteSmsSetting);
module.exports = router;