class Query
{

    // DB connection should be started here (extra class needed?)

    constructor(table)
    {
        // The actual query string
        this.query_string = `SELECT * FROM ${table}`;

        this.where_statement = 'WHERE';
    }

    used_where_statement()
    {
        this.where_statement = 'AND';
    }

    where(field, operator=null, value=null)
    {
        this.query_string   += ` ${this.where_statement} ${field} ${operator} ${value}`;
        this.used_where_statement();

        return this;
    }

    orWhere(field, operator=null, value=null)
    {
        this.query_string += ` OR ${field} ${operator} ${value}`;
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

    get()
    {
        return this.query_string;
    }

    first()
    {

    }

    count()
    {

    }

    destroy()
    {

    }

    update(new_data)
    {

    }

}

module.exports = Query;
