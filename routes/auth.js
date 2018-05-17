const { Router } = require('express');
const router     = Router();
const controller = require('../controllers/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/password/forgot', controller.forgot_password_email);
router.post('/password/reset', controller.password_reset);

module.exports = router;
