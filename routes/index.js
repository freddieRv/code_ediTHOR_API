const { Router }   = require('express');
const body_parser  = require('body-parser');
const users_router = require('./users');
const router       = Router();

// Middleware

router.use(body_parser.urlencoded({
    extended: false
}));

router.use(body_parser.json());

// Routes

router.get('/', function(request, response) {
    response.send('This is the app\'s index');
});

router.use('/users', users_router);

module.exports = router;
