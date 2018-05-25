const { Router }      = require('express');
const router          = Router();
const controller      = require('../controllers/users')
const auth_middleware = require('../middleware/auth');

router.use(auth_middleware.auth);
router.use(auth_middleware.is_admin);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
