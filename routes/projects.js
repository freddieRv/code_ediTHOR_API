const { Router }       = require('express');
const router           = Router();
const controller       = require('../controllers/projects');
const middleware       = require('../middleware/projects');
const auth_middleware  = require('../middleware/auth');
const files_middleware = require('../middleware/files');

router.use(auth_middleware.auth);

router.get('/', controller.index);
router.post('/', middleware.create_request, controller.store);

router.use(middleware.can_update);

router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/add_user', middleware.add_user, controller.add_user);
router.get('/:id/files', controller.files);
router.post('/:id/files', files_middleware.create_request, controller.add_file);

module.exports = router;
