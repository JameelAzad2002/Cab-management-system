const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.user_index);
router.get('/log-in', userController.user_login);
router.post('/log-in', userController.user_authenticate);
router.get('/sign-up', userController.user_signup);
router.post('/sign-up', userController.user_create);
router.get('/log-out', userController.user_logout);
router.get('/:id', userController.user_profile);

module.exports = router;