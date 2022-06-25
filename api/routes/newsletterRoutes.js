const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const newsletterController = require('../controllers/newsletterController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, newsletterController.getNewsletters);
router.get('/list/:newsletterId',isAuth, newsletterController.getNewsletter);
router.get('/sendNewsletterViaEmail/:newsletterId',isAuth, newsletterController.sendNewsletterViaEmail);
router.post('/new',isAuth, newsletterController.postAddNewsletter);
router.put('/update/:newsletterId',isAuth, newsletterController.putUpdateNewsletter);
router.delete('/delete/:newsletterId',isAuth, newsletterController.deleteNewsletter);
router.post('/newmember', newsletterController.postAddNewsletterMember);
router.get('/memberlist', newsletterController.getNewsletterMembers);
router.post('/postCheckCampaign', newsletterController.postCheckCampaign);
module.exports = router;