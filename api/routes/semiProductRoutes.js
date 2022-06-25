const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const semiProductController = require('../controllers/semiProductController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, semiProductController.getSemiProducts);
router.get('/find', isAuth, semiProductController.getFindSemiProducts);
router.get('/list/:semiProductId',isAuth, semiProductController.getSemiProduct);
router.post('/updatestock', isAuth, semiProductController.postUpdateSemiProductStock);
router.post('/new',isAuth, semiProductController.postAddSemiProduct);
router.put('/update/:semiProductId',isAuth, semiProductController.putUpdateSemiProduct);
router.get('/getSemiProductStockLog',isAuth, semiProductController.getSemiProductStockLog);
router.delete('/delete/:semiProductId',isAuth, semiProductController.deleteSemiProduct);


module.exports = router;