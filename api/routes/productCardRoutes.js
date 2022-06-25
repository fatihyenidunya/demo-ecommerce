const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productCardController = require('../controllers/productCardController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, productCardController.getProductCardList);
router.get('/list/:productCardId',isAuth, productCardController.getProductCard);
router.post('/new',isAuth, productCardController.postAddProductCard);
router.put('/update/:productCardId',isAuth, productCardController.putUpdateProductCard);
router.delete('/delete/:productCardId',isAuth, productCardController.deleteProductCard);

router.post('/postAddProductCardRawMaterial',isAuth, productCardController.postAddProductCardRawMaterial);
router.get('/getProductCardRawMaterials/:productCardId',isAuth, productCardController.getProductCardRawMaterials);
router.get('/deleteProductCardRawMaterial/:productCardId/:id',isAuth, productCardController.deleteProductCardRawMaterial);

router.post('/postAddProductCardSemiProduct',isAuth, productCardController.postAddProductCardSemiProduct);
router.get('/getProductCardSemiProducts/:productCardId',isAuth, productCardController.getProductCardSemiProducts);
router.get('/deleteProductCardSemiProduct/:productCardId/:id',isAuth, productCardController.deleteProductCardSemiProduct);
router.put('/productCardCopy/:productCardId',isAuth, productCardController.productCardCopy);



module.exports = router;