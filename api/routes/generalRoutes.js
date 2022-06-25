const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const generalController = require('../controllers/generalController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, generalController.getGenerals);
router.get('/list/:generalId', generalController.getGeneral);
router.post('/new',isAuth, generalController.postAddGeneral);
router.post('/postsecondimage',isAuth, generalController.postSecondImage);
router.post('/postnewslettermail', generalController.postNewsletterMail);
router.put('/update/:generalId',isAuth, generalController.putUpdateGeneral);
router.delete('/delete/:generalId',isAuth, generalController.deleteGeneral);
module.exports = router;