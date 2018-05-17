const { Router } = require('express');
const router     = Router();
const middleware = require('../middleware/auth');
const controller = require('../controllers/auth');

router.post('/register', middleware.register_request, controller.register);
router.post('/login', middleware.login_request, controller.login);
router.post('/password/forgot', controller.forgot_password_email);
router.post('/password/reset', controller.password_reset);

module.exports = router;
