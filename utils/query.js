const Executor = require('../utils/executor');

class Query
{

    constructor(table)
    {
        this.table           = table;
        this.action          = `SELECT * FROM ${table}`
        this.query_string    = '';
        this.where_statement = 'WHERE';
    }

    used_where_statement()
    {
        this.where_statement = 'AND';
    }

    sub_query()
    {
        this.where_statement = '';
    }

    sql()
    {
        return this.action + this.query_string;
    }

    exec()
    {
        var executor = new Executor();

        return executor.exec(this.sql());
    }

    where(field_or_callback, operator=null, value=null)
    {
        if (operator && value) {
            this.query_string += ` ${this.where_statement} ${field_or_callback} ${operator} ${value}`;
        } else {
            this.query_string += ` ${this.where_statement} (`;
            this.sub_query();
            field_or_callback(this);
            this.query_string += ` )`;
        }

        this.used_where_statement();

        return this;
    }

    orWhere(field_or_callback, operator=null, value=null)
    {
        if (operator && value) {
            this.query_string += ` OR ${field_or_callback} ${operator} ${value}`;
        } else {
            this.query_string += ` ${this.where_statement} (`;
            this.sub_query();
            field_or_callback(this);
            this.query_string += ` )`;
        }
        return this;
    }

    whereNull(field)
    {
        this.query_string += ` ${this.where_statement} ${field} IS NULL`;
        this.used_where_statement();

        return this;
    }

    whereNotNull(field)
    {
        this.query_string += ` ${this.where_statement} ${field} IS NOT NULL`;
        this.used_where_statement();

        return this;
    }

    whereIn(field, values)
    {
        this.query_string += ` ${this.where_statement} ${field} IN ( ${values.join(', ')} )`;
        this.used_where_statement();

        return this;
    }

    whereNotIn(field, values)
    {
        this.query_string += ` ${this.where_statement} ${field} NOT IN ( ${values.join(', ')} )`;
        this.used_where_statement();

        return this;
    }

    order_by(field, direction='ASC')
    {
        this.query_string += ` ORDER BY ${field} ${direction}`;

        return this;
    }

    limit(limit=30)
    {
        this.query_string += ` LIMIT ${limit}`;

        return this;
    }

    get()
    {
        // TODO: return objects (parse response)

        return this.exec();
    }

    first()
    {

    }

    count()
    {
        this.action = `SELECT COUNT(*) FROM ${this.table}`;


        return this.sql();
    }

    destroy()
    {
        this.action = `DELETE FROM ${this.table}`;


        return this.sql();
    }

    createOrUpdate(entity)
    {
        var db_entity =  null; // TODO: get row from db

        if (db_entity) {
            this.action = `UPDATE ${this.table} SET`;

            Object.keys(entity.data).forEach(function(key) {
                this.action += `${key} = ${ '\'' +  entity.data[key] + '\'' }, `;
            });

            this.action = this.action.substring(0, this.action.length - 2);
        } else {
            var values = [];

            Object.values(entity.data).forEach(function(value) {
                values.push('\'' + value + '\'');
            });

            this.action = `INSERT INTO ${ this.table } ( ${ Object.keys(entity.data).join(', ') } )`
                        + ` VALUES ( ${ values.join(', ') } )`
        }

        return this.sql();
    }

    one_relationship(entity, related_entity, foreign_key, key)
    {
        this.query_string += ` ${this.where_statement} ${related_entity.table() + '.' + foreign_key} = ${entity.data[key]}`;
        this.used_where_statement();

        return this;
    }

    many_relationship(entity, related_entity, foreign_key, key)
    {
        this.query_string += ` ${this.where_statement} ${this.table + '.' + foreign_key} = ${entity.data[key]}`;
        this.used_where_statement();

        return this;
    }
}

module.exports = Query;
