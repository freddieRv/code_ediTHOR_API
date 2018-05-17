const { Router }      = require('express');
const body_parser     = require('body-parser');
const users_router    = require('./users');
const files_router    = require('./files');
const projects_router = require('./projects');
const router          = Router();

// Middleware

router.use(body_parser.urlencoded({
    extended: false
}));

router.use(body_parser.json());

// Routes

router.get('/', function(request, response) {
    response.send('Code EdiTHOR API v1.0');
});

router.use('/users', users_router);
router.use('/files', files_router);
router.use('/projects', projects_router);

module.exports = router;
