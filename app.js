var express = require('express');
var app     = express();
var router  = require('./routes');
var path    = require('path');

app.use(express.static(path.join(__dirname, 'storage')));

app.use('/', router);

app.listen(3000, function () {
    console.log('App listening on port 3000 \n');
});
