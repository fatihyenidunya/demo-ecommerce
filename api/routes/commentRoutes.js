const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const isAuth = require('../middleware/is-auth');

// router.get('/list', commentController.getComments);
router.get('/list/:commentId',isAuth, commentController.getComment);
router.get('/comments',isAuth, commentController.getComments);
router.get('/dashboard-list',isAuth, commentController.getDashboardComments);
router.post('/new', commentController.postAddComment);
router.put('/update/:commentId',isAuth, commentController.putUpdateComment);
router.delete('/delete/:commentId',isAuth, commentController.deleteComment);
module.exports = router;