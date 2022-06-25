const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const errorController = require('../controllers/errorController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, errorController.getErrors);
router.get('/list/:errorId',isAuth, errorController.getError);
router.post('/new',isAuth, errorController.postAddError);
router.put('/update/:errorId',isAuth, errorController.putUpdateError);
router.delete('/delete/:errorId',isAuth, errorController.deleteError);


module.exports = router;