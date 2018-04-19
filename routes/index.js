const { Router }   = require('express');
const users_router = require('./users');
const router       = Router();

router.get('/', function(request, response) {
    response.send('This is the app\'s index');
});

router.use('/users', users_router);

module.exports = router;
