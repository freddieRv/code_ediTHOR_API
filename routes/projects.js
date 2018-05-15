const { Router }  = require('express');
const router      = Router();
const controller  = require('../controllers/projects')
const Middleware  = require('../middleware/projects');

router.get('/', controller.index);
router.post('/', Middleware.create_request, controller.store);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/:id/files', controller.files);

module.exports = router;
