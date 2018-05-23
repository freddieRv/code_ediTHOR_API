var express = require('express');
var app     = express();
var router  = require('./routes');

app.use('/', router);

app.listen(3000, function () {
    console.log('App listening on port 3000 \n');
});
