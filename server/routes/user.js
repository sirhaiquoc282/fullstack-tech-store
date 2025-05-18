const router = require('express').Router();
const { register, login, getCurrent, refreshAccessToken } = require('../controllers/userController');
const { verifyAccessToken } = require('../middlewares/verifyToken')

router.post('/register', register);
router.post('/login', login);
router.get('/current', verifyAccessToken, getCurrent);
router.post('/refresh-token', refreshAccessToken);
module.exports = router;