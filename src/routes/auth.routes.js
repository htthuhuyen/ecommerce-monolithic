
const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Truy cap thanh cong',
        user: req.user
    });
});

module.exports = router;
