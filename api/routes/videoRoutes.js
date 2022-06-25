const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const videoController = require('../controllers/videoController');
const isAuth = require('../middleware/is-auth');

router.get('/list',isAuth, videoController.getVideos);
router.get('/mainpage', videoController.getMainPageVideos);
router.get('/medias', videoController.getAllVideos);
router.get('/list/:videoId',isAuth, videoController.getVideo);
router.post('/new',isAuth, videoController.postAddVideo);
router.put('/update/:videoId',isAuth, videoController.putUpdateVideo);
router.delete('/delete/:videoId',isAuth, videoController.deleteVideo);
module.exports = router;