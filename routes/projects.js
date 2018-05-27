const { Router }       = require('express');
const router           = Router();
const controller       = require('../controllers/projects');
const middleware       = require('../middleware/projects');
const auth_middleware  = require('../middleware/auth');
const files_middleware = require('../middleware/files');
const users_middleware = require('../middleware/users');

router.get('/:id/download', controller.download);

// Middleware
router.use(auth_middleware.auth);
router.use(users_middleware.is_active);

// Routes
router.get('/', controller.index);
router.post('/', middleware.create_request, controller.store);
router.get('/:id', controller.show);
router.put('/:id', middleware.can_update, controller.update);
router.post('/:id/add_user', middleware.add_user, controller.add_user);
router.post('/:id/remove_user', middleware.remove_user, controller.remove_user);
router.get('/:id/files', middleware.can_update, controller.files);
router.post('/:id/files', middleware.can_update, files_middleware.create_file_request, files_middleware.father_belongs_to_project, controller.add_file);
router.post('/:id/dir', middleware.can_update, files_middleware.create_dir_request, files_middleware.father_belongs_to_project, controller.add_dir);
router.delete('/:id', middleware.can_delete, controller.destroy);

module.exports = router;
