const { Router }      = require('express');
const router          = Router();
const controller      = require('../controllers/projects');
const middleware      = require('../middleware/projects');
const auth_middleware = require('../middleware/auth');

router.use(auth_middleware.auth);
router.get('/', controller.index);
router.post('/', middleware.create_request, controller.store);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/add_user', middleware.add_user, controller.add_user);

module.exports = router;
