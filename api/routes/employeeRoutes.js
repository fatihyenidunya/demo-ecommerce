const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, employeeController.getEmployees);
router.get('/list/:employeeId',isAuth, employeeController.getEmployee);
router.post('/new',isAuth, employeeController.postAddEmployee);
router.put('/update/:employeeId',isAuth, employeeController.putUpdateEmployee);
router.delete('/delete/:employeeId',isAuth, employeeController.deleteEmployee);


module.exports = router;