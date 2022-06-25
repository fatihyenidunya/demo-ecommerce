const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const userController = require('../controllers/userController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, userController.getUsers);
router.get('/userlist/:role/:username', userController.getUsersByRole);
router.get('/list/:userId',isAuth, userController.getUser);
router.post('/new',[

    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail address already exists');
                }
            })
        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('userName').trim().not().isEmpty(),

],isAuth,userController.postAddUser);
router.put('/update/:userId',isAuth, userController.putUpdateUser);
router.delete('/delete/:userId',isAuth, userController.deleteUser);

router.post('/login', userController.login);


module.exports = router;