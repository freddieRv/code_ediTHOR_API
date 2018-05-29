const { Router }      = require('express');
const router          = Router();
const controller      = require('../controllers/users')
const auth_middleware = require('../middleware/auth');

router.get('/:id', controller.show);

router.use(auth_middleware.auth);

router.get('/', auth_middleware.is_admin, controller.index);
router.put('/:id', auth_middleware.is_admin, controller.update);
router.delete('/:id', auth_middleware.is_admin, controller.destroy);

module.exports = router;
