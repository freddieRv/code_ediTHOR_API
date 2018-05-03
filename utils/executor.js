const DB  = require('mysql');
const ENV = require('../env');

class Executor
{
    constructor() {
        this.init_db_connection();
    }

    init_db_connection()
    {
        this.connection = DB.createConnection({
            host:     env.db.host,
            user:     env.db.user,
            password: env.db.password,
            database: env.db.name,
        });

        db.connect(function(err) {
            if (err) {
                console.error('DB CONNECTION ERROR: ' + err.stack);
            }
        });
    }

    exec(query, callback)
    {
        db.query(query, callback);
        // this.connection.end();
    }
}

module.exports = Executor;
