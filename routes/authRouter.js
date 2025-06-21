const router = require('express').Router();
const { googleLoing } = require('../controllers/authController');

router.get('/test', (req, res) => {
    res.send('Auth route is working');
})

router.get('/google-login', googleLoing);

module.exports = router;