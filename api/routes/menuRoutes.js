const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const menuController = require('../controllers/menuController');

router.get('/list', menuController.getMenus);
router.get('/list/:menuId', menuController.getMenu);
router.post('/new', menuController.postAddMenu);
router.post('/newRoleMenu', menuController.postRoleMenu);
router.get('/roleMenus/:role', menuController.getRoleMenus);
router.put('/update/:menuId', menuController.putUpdateMenu);



module.exports = router;