// DB conection to sphinx
var mysql = require('mysql');
var sphinx = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : '',
    port     : 9306
});


var db = require('mongoskin').db('mongodb://localhost/apiuser');

//creamos un objeto para ir almacenando todo lo que necesitemos
var jobsModel = function (config) {
    var config = config || {};

}

jobsModel.prototype.search = function(req, res) {
    sphinx.getConnection(function(err, connection) {
        var id = req.params.key;
        db.collection('users').findOne({key: id}, function (err, result) {
            if (err) throw err;
            if (result === null) {
                res.send({
                    result: 'error Users',
                    err:    (err)?err.code:'U1'
                });
                return false;

            }
            console.log(result);
            if (err  ) {
                console.error('CONNECTION error: ',err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err:    (err)?err.code:'U2'
                });
            } else {
                // query the database using connection
                //connection.query('SELECT * FROM '+req.params.table+' ORDER BY id DESC LIMIT 20', req.params.id, function(err, rows, fields) {
                connection.query('SELECT * FROM Company where MATCH(\'"'+ req.params.query +'*"/0.8\') LIMIT 20',  function(err, rows, fields) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.send({
                            result: 'error',
                            err: err.code
                        });
                    }
                    res.send({
                        result: 'success',
                        err: '',
                        json: rows,
                        length: rows.length
                    });
                    connection.release();
                });
            }
            this.isValid= true;

        });
        return;
    });

    //res.send([{name:'wine1'}, {name:'wine2'}, {name:'wine3'}]);
};

module.exports= jobsModel;