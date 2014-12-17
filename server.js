var express = require('express'),
    app = express(),
    jobs = require('./routes/search');
var port    = 	process.env.PORT || 3000;

var router = express.Router();

// route middleware that will happen on every request
router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    // continue doing what we were doing and go to the route
    next();
});
var master = new jobs();

router.get('/api/search/:user/:key/:query',master.search);

app.use('/', router);
app.listen(port);
console.log('Listening on port 3000...');