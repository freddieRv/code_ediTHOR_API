var express = require('express');
var app     = express();
var router  = require('./routes');

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', null);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');

    // Pass to next layer of middleware
    next();
});

app.use('/', router);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
