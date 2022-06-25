const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const customController = require('../controllers/customController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, customController.getCustoms);
router.get('/list/:customId',isAuth, customController.getCustom);
router.post('/new',isAuth, customController.postAddCustom);
router.put('/update/:customId',isAuth, customController.putUpdateCustom);
router.delete('/delete/:customId',isAuth, customController.deleteCustom);


module.exports = router;