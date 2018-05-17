const { Router }      = require('express');
const router          = Router();
const controller      = require('../controllers/projects');
const middleware      = require('../middleware/projects');
const auth_middleware = require('../middleware/auth');

// TODO: auth middleware

router.get('/', auth_middleware.auth, controller.index);
router.post('/', middleware.create_request, controller.store);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/add_user', middleware.add_user, controller.add_user);

module.exports = router;
