const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const profileController = require('../../controllers/customer-controllers/profileController');



router.get('/detail/:id', profileController.getProfile);
router.put('/update/:id', profileController.putUpdateProfile);
router.get('/contacts/:id', profileController.getContacts);
router.get('/contact/:id', profileController.getContact);
router.get('/customerinfo/:id', profileController.getCustomerInfo);
router.post('/contact', profileController.postContact);
router.put('/contact/:id', profileController.putUpdateContact);
router.delete('/deletecontact/:customerId/:contactId', profileController.deleteContact);

module.exports = router;

