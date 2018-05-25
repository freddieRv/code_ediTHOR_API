const { Router } = require('express');
const router     = Router();
const controller = require('../controllers/files');
const auth_middleware = require('../middleware/auth');

router.use(auth_middleware.auth);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/exec', controller.exec);

module.exports = router;
