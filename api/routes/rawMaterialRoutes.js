const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rawMaterialController = require('../controllers/rawMaterialController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, rawMaterialController.getRawMaterials);
router.get('/find', isAuth, rawMaterialController.getFindRawMaterials);
router.get('/list/:rawMaterialId',isAuth, rawMaterialController.getRawMaterial);
router.post('/new',isAuth, rawMaterialController.postAddRawMaterial);
router.post('/updatestock', isAuth, rawMaterialController.postUpdateRawMaterialStock);
router.put('/update/:rawMaterialId',isAuth, rawMaterialController.putUpdateRawMaterial);
router.get('/getRawMaterialStockLog',isAuth, rawMaterialController.getRawMaterialStockLog);
router.delete('/delete/:rawMaterialId',isAuth, rawMaterialController.deleteRawMaterial);


module.exports = router;