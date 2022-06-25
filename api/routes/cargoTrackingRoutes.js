const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cargoTrackingController = require('../controllers/cargoTrackingController');
const isAuth = require('../middleware/is-auth');

// router.get('/list',isAuth, cargoTrackingController.getCargoTrackings);
router.get('/list/:cargoTrackingId',isAuth, cargoTrackingController.getCargoTracking);
router.post('/new',isAuth, cargoTrackingController.postAddCargoTracking);
router.put('/update/:cargoTrackingId',isAuth, cargoTrackingController.putUpdateCargoTracking);
router.delete('/delete/:cargoTrackingId',isAuth, cargoTrackingController.deleteCargoTracking);

router.get('/cargotracking',isAuth, cargoTrackingController.getCargoTrackings);


module.exports = router;