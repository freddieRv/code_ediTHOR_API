const DB  = require('mysql');
const ENV = require('../env');

class Executor
{
    constructor() {
        this.init_db_connection();
    }

    init_db_connection()
    {
        this.db_connection = DB.createConnection({
            host:     ENV.db.host,
            user:     ENV.db.user,
            password: ENV.db.password,
            database: ENV.db.name,
        });

        this.db_connection.connect(function(err) {
            if (err) {
                console.error('DB CONNECTION ERROR: ' + err.stack);
            }
        });
    }

    exec(query)
    {
        var db = this.db_connection;

        console.log(query);

        return new Promise(function(resolve, reject) {
            db.query(query, function(err, res, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}

module.exports = Executor;
