const { Router }      = require('express');
const router          = Router();
const controller      = require('../controllers/files');
const auth_middleware = require('../middleware/auth');
const middleware      = require('../middleware/files');

// Middleware
router.use(auth_middleware.auth);

// Routes
router.get('/:id', middleware.can_show, controller.show);
router.put('/:id', middleware.can_show, controller.update);
router.delete('/:id', middleware.can_show, controller.destroy);
router.get('/:id/exec', middleware.can_show, controller.exec);

module.exports = router;
