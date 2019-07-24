var express = require('express');
var server = express();
var router = require('./router');

server.set('port', 4000);

server.use(function (req, res, next) {
    res.header("Content-Type", "text/html");
    next();
});

server.use('/', router);

server.listen(server.get('port'), function () {
    console.log('NODE_ENV: %s', process.env.NODE_ENV);
    console.log('Node version: %s', process.version);
    console.log('Server listening on ' + server.get('port'));
});
