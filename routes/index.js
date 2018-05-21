const { Router }      = require('express');
const body_parser     = require('body-parser');
const users_router    = require('./users');
const files_router    = require('./files');
const projects_router = require('./projects');
const auth_router     = require('./auth');
const router          = Router();

// Common headers, also handle CORS pre-flight OPTIONS request
router.use(function (req, res, next) {
    // Websites allowed to connect to the api
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Allowed request methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Allowed request headers
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');

    // Pass to next layer of middleware if neccesary
    if (req.method == 'OPTIONS') {
        res.send('Code EdiTHOR API v1.0');
        next('router');
    } else {
        next();
    }

});

// Middleware
router.use(body_parser.urlencoded({
    extended: false
}));

router.use(body_parser.json());

// Routes
router.get('/', function(request, response) {
    response.send('Code EdiTHOR API v1.0');
});

router.use('/', auth_router);
router.use('/users', users_router);
router.use('/files', files_router);
router.use('/projects', projects_router);

module.exports = router;
