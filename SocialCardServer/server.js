var express = require('express');
var server = express();
var router = require('./router');

server.set('port', 4500);

server.use(function (req, res, next) {
    res.header("Content-Type", "text/html");
    next();
});

server.use('/', router);

server.use(function (err, req, res, next) {
    console.log(err)
    if (err) {
        let error = {
            "error": {
                "code": "UNKNOWNERROR",
                "description": "Some unknown system error has occoured. Please contact the system administrator.",
            }
        };
        res.status(500, { "Content-Type": "application/json" })
        res.write(JSON.stringify(error))
        res.end();
    }
});

server.listen(server.get('port'), function () {
    console.log('NODE_ENV: %s', process.env.NODE_ENV);
    console.log('Node version: %s', process.version);
    console.log('Server listening on ' + server.get('port'));
});
