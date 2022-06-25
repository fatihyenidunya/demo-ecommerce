const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const userRoleController = require('../controllers/userRoleController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, userRoleController.getRoles);

router.get('/list/:roleId',isAuth, userRoleController.getRole);
router.post('/new',isAuth,userRoleController.postAddRole);
router.put('/update/:roleId',isAuth, userRoleController.putUpdateRole);
router.delete('/delete/:roleId',isAuth, userRoleController.deleteRole);



module.exports = router;