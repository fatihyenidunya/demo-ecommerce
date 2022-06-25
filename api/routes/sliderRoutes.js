const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const sliderController = require('../controllers/sliderController');

router.get('/list', sliderController.getSliders);
router.get('/list/:sliderId', sliderController.getSlider);
router.post('/new', sliderController.postAddSlider);
router.put('/update/:sliderId', sliderController.putUpdateSlider);
router.delete('/delete/:sliderId', sliderController.deleteSlider);
module.exports = router;