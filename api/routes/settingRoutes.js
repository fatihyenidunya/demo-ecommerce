const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const settingController = require('../controllers/settingController');

router.get('/list', settingController.getSettings);
router.get('/list/:company', settingController.getSetting);
router.post('/new', settingController.postAddSetting);
router.put('/update/:company', settingController.putUpdateSetting);
router.delete('/delete/:settingId', settingController.deleteSetting);


module.exports = router;