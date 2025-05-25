const express = require('express');
const router = express.Router();
const { register, login, getCurrent, refreshAccessToken } = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/register', register);

router.post('/login', login);

router.get('/current', verifyAccessToken, getCurrent);

router.get('/refresh-token', refreshAccessToken);

module.exports = router;
